import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Confetti from 'react-confetti';

import {
	aBtn,
	backspaceBtn,
	enterBtn,
	leftArrowBtn,
	rightArrowBtn,
	spaceBtn,
	tabBtn,
	zBtn,
} from '../constants/Keycodes';
import { getFetch } from '../functions/FetchFunctions';
import getThemeClassname from '../functions/getThemeClassname';
import hasValidCharacters from '../functions/hasValidCharacters';
import isOneOff from '../functions/isOneOff';
import { applyFrom, applyTo, applyGame } from '../thunk/GameThunk.jsx';

import Loading from './Loading.jsx';

import './Solo.less';

const maxLen = 4;
const regex = /([a-zA-Z])/g;

const getFormattedTimer = timer => {
	const seconds = ('0' + (Math.floor(timer / 10) % 100)).slice(-2);
	const minutes = ('0' + (Math.floor(timer / 1000) % 60)).slice(-2);
	const hours = ('0' + (Math.floor(timer / 60000) % 60)).slice(-2);

	return `${hours}h : ${minutes}m : ${seconds}s`;
};

export const Solo = ({
	dark,
	from,
	to,
	onChangeFrom,
	onChangeTo,
	onChangeGame,
}) => {
	const [win, setWin] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	// This allows for a bit of a hack way to do this fadeOut animation for the editor.
	// Need to study how others do Accordians or menu animations to see how to not do this
	// Or do a smarter hack lol
	const [showEditor, setShowEditor] = useState('');
	const [editorFromVal, setEditorFromVal] = useState(from);
	const [editorToVal, setEditorToVal] = useState(to);

	const [history, setHistory] = useState([]);
	const [guessVals, setGuessVals] = useState([]);
	const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
	const historyBottomRef = useRef(null);

	const [timer, setTimer] = useState(0);

	useEffect(() => {
		let interval = null;
		if (!win) {
			interval = setInterval(() => {
				setTimer(seconds => seconds + 1);
			}, 100);
		}
		return () => clearInterval(interval);
	}, [timer, win]);

	useEffect(() => {
		document.title = 'Solo - Delta';
	}, []);

	useEffect(() => {
		if (!from && !to) {
			setLoading(true);
			getFetch('http://localhost:5000/api/v1/games/words').then(res => {
				if (res.success && res.data && res.data.from && res.data.to) {
					onChangeGame({ from: res.data.from, to: res.data.to });
					setHistory([res.data.from]);
					setGuessVals(res.data.from.match(regex));
					setLoading(false);
				} else {
					// Error is for guessing, need another way to log this TODO
					// setError('Something went wrong grabbing game words!');
				}
			});
		} else {
			setHistory([from]);
			setGuessVals(from.match(regex));
		}
	}, [
		from,
		to,
		onChangeFrom,
		onChangeTo,
		setLoading,
		setHistory,
		setGuessVals,
	]);

	useEffect(() => {
		historyBottomRef.current.scrollIntoView({
			behavior: 'smooth',
		});
	}, [history]);

	const handleNewClick = useCallback(() => {
		setWin(false);
		setError(null);
		inputRefs.forEach(inputRef => {
			inputRef.current.value = '';
		});
		setLoading(true);
		getFetch('http://localhost:5000/api/v1/games/words').then(res => {
			if (res.success && res.data && res.data.from && res.data.to) {
				onChangeGame({ from: res.data.from, to: res.data.to });
				setEditorFromVal(res.data.from);
				setEditorToVal(res.data.to);
				setLoading(false);
				setTimer(0);
			} else {
				// Error is for guessing, need another way to log this TODO
				// setError('Something went wrong grabbing game words!');
			}
		});
	}, [
		onChangeFrom,
		onChangeTo,
		inputRefs,
		setWin,
		setError,
		setLoading,
		setEditorFromVal,
		setEditorToVal,
		setTimer,
	]);

	const handleEditClick = useCallback(() => {
		setShowEditor('show');
	}, [setShowEditor]);

	const handleChangeFromEditor = useCallback(
		event => {
			if (event && event.target) {
				const val = event.target.value ? event.target.value.toString() : '';
				if (hasValidCharacters(val)) setEditorFromVal(val);
			}
		},
		[setEditorFromVal]
	);

	const handleChangeToEditor = useCallback(
		event => {
			if (event && event.target) {
				const val = event.target.value ? event.target.value.toString() : '';
				if (hasValidCharacters(val)) setEditorToVal(val);
			}
		},
		[setEditorToVal]
	);

	const handleKeyDownFromEditor = useCallback(
		event => {
			if (event && event.keyCode) {
				if (event.keyCode === enterBtn || event.keyCode === spaceBtn) {
					event.preventDefault();
					handleSubmitEditor();
				}
			}
		},
		[editorFromVal, editorToVal]
	);

	const handleSubmitEditor = useCallback(() => {
		if (editorFromVal.length < 4 || editorToVal.length < 4) {
			// Maybe I'll customize an alert in the future, TODO
			alert('Words must be 4 letters long!');
			return;
		}

		setLoading(true);
		getFetch(
			`/api/v1/words/validateMany?words=${editorFromVal}&words=${editorToVal}`
		).then(res => {
			if (res) {
				setShowEditor('hidden');
				onChangeGame({ from: editorFromVal, to: editorToVal });
				setTimer(0);
			} else {
				alert('Word must be a real 4 letter English word!');
			}
			setLoading(false);
		});
	}, [editorFromVal, editorToVal, setShowEditor, setLoading, setTimer]);

	const handleCloseEditor = useCallback(() => {
		setShowEditor('hidden');
	}, [setShowEditor]);

	const handleKeyDown = useCallback(
		event => {
			if (event && event.target && event.keyCode && event.key) {
				const i = parseInt(event.target.dataset.id);
				const next = (i + 1) % maxLen;
				const prev = i - 1 < 0 ? maxLen - 1 : i - 1;

				if (event.keyCode >= aBtn && event.keyCode <= zBtn) {
					event.preventDefault();
					guessVals[i] = event.key;
					inputRefs[i].current.value = event.key;
					if (next >= i) {
						inputRefs[next].current.focus();
						inputRefs[next].current.select();
					}
				} else {
					switch (event.keyCode) {
						case enterBtn:
							event.preventDefault();
							handleEnterClick();
							inputRefs[0].current.focus();
							break;
						case backspaceBtn:
							event.preventDefault();
							inputRefs[i].current.value = '';
							if (prev <= i) {
								inputRefs[prev].current.focus();
								inputRefs[prev].current.select();
							}
							break;
						case rightArrowBtn:
							inputRefs[next].current.focus();
							inputRefs[next].current.select();
							break;
						case leftArrowBtn:
							inputRefs[prev].current.focus();
							inputRefs[prev].current.select();
							break;
						case tabBtn:
							//do nothing
							break;
						default:
							event.preventDefault();
							break;
					}
				}
			}
		},
		[inputRefs]
	);

	const handleEnterClick = useCallback(() => {
		const guess = guessVals.join('');
		inputRefs.forEach(inputRef => {
			inputRef.current.value = '';
		});

		if (isOneOff(guess, history[history.length - 1])) {
			if (guess === to) {
				setWin(true);
				setError(null);
			} else {
				getFetch(
					`http://localhost:5000/api/v1/words/validate?word=${guess}`
				).then(res => {
					if (res) {
						setHistory(history => [...history, guess]);
						setError(null);
					} else {
						setGuessVals(history[history.length - 1].match(regex));
						setError("Word entered isn't a real word");
					}
				});
			}
		} else {
			setGuessVals(history[history.length - 1].match(regex));
			setError('Word must be one letter off from previous word');
		}
	}, [
		guessVals,
		setWin,
		history,
		setHistory,
		setError,
		setGuessVals,
		setTimer,
	]);

	return (
		<div className={getThemeClassname('Solo', dark)}>
			<h2 className="Solo__words">
				From: {from} -> To: {to}
			</h2>
			<div className="Solo__btns">
				<button
					id="soloNewBtn"
					className="Solo__btn"
					aria-label="New Game"
					onClick={handleNewClick}
				>
					New Game
				</button>
				<button
					id="soloEditGameBtn"
					className="Solo__btn"
					aria-label="Edit Game"
					onClick={handleEditClick}
				>
					Edit Game
				</button>
			</div>
			{showEditor && (
				<div className={'Solo__editor  Solo__editor--' + showEditor}>
					<div className="Solo__editorContent">
						<div className="Solo__editorForms">
							<div className="Solo__editorForm">
								<label htmlFor="soloEditFromInput">From:</label>
								<input
									id="soloEditFromInput"
									className="Solo__EditorInput"
									type="text"
									maxLength={4}
									value={editorFromVal}
									onChange={handleChangeFromEditor}
									onKeyDown={handleKeyDownFromEditor}
								/>
							</div>
							<div className="Solo__editor--center">-></div>
							<div className="Solo__editorForm">
								<label htmlFor="soloEditToInput" className="Solo__editorLabel">
									To:
								</label>
								<input
									id="soloEditToInput"
									className="Solo__EditorInput"
									type="text"
									maxLength={4}
									value={editorToVal}
									onChange={handleChangeToEditor}
									onKeyDown={handleKeyDownFromEditor}
								/>
							</div>
						</div>
						<div className="Solo__editorBtns">
							<button
								id="soloEditorSubmitBtn"
								className="Solo__editorBtn"
								aria-label="Submit"
								onClick={handleSubmitEditor}
							>
								Submit
							</button>
							<button
								id="soloEditorCancelBtn"
								className="Solo__editorBtn"
								aria-label="Cancel"
								onClick={handleCloseEditor}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="Solo__timer">{getFormattedTimer(timer)}</div>

			<div className="Solo__game">
				<div className="Solo__history" aria-labelledby="soloHistory">
					<h3 id="soloHistory" className="Solo__historyLabel">
						History
					</h3>
					<ul className="Solo__historyList">
						{history.map((item, i) => (
							<li key={`Solo__historyItem--${i}`}>{item}</li>
						))}
						<li ref={historyBottomRef} />
					</ul>
				</div>

				<div className="Solo__guessContainer">
					<div className="Solo__guessInputs">
						<div>
							{guessVals.map((val, i) => (
								<input
									id={'soloGuessInput-' + i}
									ref={inputRefs[i]}
									data-id={i}
									className="Solo__guessInput"
									type="text"
									maxLength={1}
									placeholder={val}
									onKeyDown={handleKeyDown}
									key={'Solo__guessInput-' + i}
								/>
							))}
						</div>

						<button
							id="soloEnterBtn"
							className="Solo__enterBtn"
							onClick={handleEnterClick}
						>
							Enter
						</button>
					</div>

					<div className="Solo__gameError">{error}</div>
				</div>
			</div>

			{loading && createPortal(<Loading />, document.body)}
			{win &&
				createPortal(
					<div className="Solo__win">
						<Confetti number={50} />
						<div className="Solo__winText">You've won!</div>
						<button
							id="soloWinNewGame"
							className="Solo__winBtn"
							aria-label="New Game"
							onClick={handleNewClick}
						>
							New Game
						</button>
						<div className="Solo__stats">
							{history.length === 1
								? 'It took you only one word! '
								: `It took you ${history.length} words! `}
							It also took you {getFormattedTimer(timer)}
						</div>
					</div>,
					document.body
				)}
			<div className="Solo__easterEgg">This is an incredibly tiny screen</div>
		</div>
	);
};

Solo.propTypes = {
	dark: PropTypes.bool,
	from: PropTypes.string,
	to: PropTypes.string,
	onChangeFrom: PropTypes.func,
	onChangeTo: PropTypes.func,
	onChangeGame: PropTypes.func,
};

export const mapStateToProps = ({
	game: {
		solo: { from, to },
	},
	theme: { dark },
}) => ({
	dark,
	from,
	to,
});

const mapDispatchToProps = {
	onChangeFrom: applyFrom,
	onChangeTo: applyTo,
	onChangeGame: applyGame,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Solo);

// Fun ideas: Reverse button. Work from To -> From
