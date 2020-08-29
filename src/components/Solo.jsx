import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	aBtn,
	backspaceBtn,
	enterBtn,
	leftArrowBtn,
	rightArrowBtn,
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

export const Solo = ({
	dark,
	from,
	to,
	onChangeFrom,
	onChangeTo,
	onChangeGame,
}) => {
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
					// Error is for guessing, need another way to log this
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

	// Duplicate code here, but not sure what is the best way to pull it out, because of the state vals
	const handleNewClick = useCallback(() => {
		setLoading(true);
		getFetch('http://localhost:5000/api/v1/games/words').then(res => {
			if (res.success && res.data && res.data.from && res.data.to) {
				onChangeGame({ from: res.data.from, to: res.data.to });
				setLoading(false);
			} else {
				// Error is for guessing, need another way to log this
				// setError('Something went wrong grabbing game words!');
			}
		});
	}, [onChangeFrom, onChangeTo, setLoading]);

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
			} else {
				alert('Word must be a real 4 letter English word!');
			}
			setLoading(false);
		});
	}, [editorFromVal, editorToVal, setShowEditor, setLoading]);

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
							inputRefs[prev].current.focus();
							inputRefs[prev].current.select();
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
		getFetch(`http://localhost:5000/api/v1/words/validate?word=${guess}`).then(
			res => {
				if (res) {
					if (isOneOff(guess, history[history.length - 1])) {
						setHistory(history => [...history, guess]);
						inputRefs.forEach(inputRef => (inputRef.current.value = ''));
					} else {
						setError('Word must be one letter off from previous word!');
					}
				} else {
					setError('Invalid word when trying to add to history');
				}
			}
		);
	}, [guessVals, history, setHistory, setError]);

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

			<div className="Solo__history" aria-labelledby="soloHistory">
				<h3 id="soloHistory" className="Solo__historyLabel">
					History
				</h3>
				<ul className="Solo__historyList">
					{history.map((item, i) => (
						<li ref={testRef} key={`Solo__historyItem--${i}`}>
							{item}
						</li>
					))}
				</ul>
			</div>

			<div className="Solo__guessInputs">
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

				<button
					id="soloEnterBtn"
					className="Solo__enterBtn"
					onClick={handleEnterClick}
				>
					Enter
				</button>
			</div>

			<div>{error}</div>

			{loading && createPortal(<Loading />, document.body)}
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
