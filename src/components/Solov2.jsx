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
import isOneOff from '../functions/isOneOff';
import { applyFrom, applyTo, applyGame } from '../thunk/GameThunk.jsx';

import Loading from './Loading.jsx';
import HintButton from './HintButton.jsx';
import StealthForm from './StealthForm.jsx';
import ThemeToggle from './ThemeToggle.jsx';

import './Solov2.less';

const maxLen = 4;
const regex = /([a-zA-Z])/g;

const getFormattedTimer = timer => {
	let centis = timer;
	const minutes = Math.floor(centis / 6000);
	centis = centis - 6000 * minutes;
	const seconds = Math.floor(centis / 100);
	centis = centis - 100 * seconds;

	return `${minutes < 10 ? '0' + minutes : minutes}m : ${
		seconds < 10 ? '0' + seconds : seconds
	}s : ${centis < 10 ? '0' + centis : centis}cs`;
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
	const [error, setError] = useState('');

	// This allows for a bit of a hack way to do this fadeOut animation for the editor.
	// Need to study how others do Accordians or menu animations to see how to not do this
	// Or do a smarter hack lol
	const [numHints, setNumHints] = useState(3);
	const [hint, setHint] = useState(null);
	const [solution, setSolution] = useState(null);

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
			}, 10);
		}
		return () => clearInterval(interval);
	}, [timer, win]);

	useEffect(() => {
		document.title = 'Solo - Delta';
	}, []);

	useEffect(() => {
		if (!from && !to) {
			setLoading(true);
			getFetch('/api/v1/words')
				.then(res => {
					if (res.from && res.to) {
						onChangeGame({ from: res.from, to: res.to });
						setHistory([res.from]);
						setGuessVals(res.from.match(regex));
					} else {
						// Error is for guessing, need another way to log this
						// setError('Something went wrong grabbing game words!');
					}
				})
				.then(() => setLoading(false))
				.catch(err => console.log(err));
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
		setNumHints(3);
		setError(null);

		// Has to be done, animated bug would show the things closing over and over
		setShowEditor('');
		setShowHint('');

		setSolution(null);
		inputRefs.forEach(inputRef => {
			inputRef.current.value = '';
		});
		setLoading(true);
		getFetch('/api/v1/words')
			.then(res => {
				if (res.from && res.to) {
					onChangeGame({ from: res.from, to: res.to });
					setEditorFromVal(res.from);
					setEditorToVal(res.to);
					setTimer(0);
				} else {
					// Error is for guessing, need another way to log this
					// setError('Something went wrong grabbing game words!');
				}
			})
			.then(() => setLoading(false));
	}, [
		onChangeGame,
		inputRefs,
		setWin,
		setError,
		setNumHints,
		setSolution,
		setLoading,
		setTimer,
	]);

	const handleHintClick = useCallback(() => {
		setLoading(true);
		getFetch(`/api/v1/hint?from=${history[history.length - 1]}&to=${to}`)
			.then(res => {
				if (res.hint && (res.numLeft === 0 || res.numLeft !== null)) {
					setNumHints(numHints => numHints - 1);
					setHint({ word: res.hint, numLeft: res.numLeft });
				} else {
					// Error is for guessing, need another way to log this
					// setError('Something went wrong grabbing game words!');
				}
			})
			.then(() => setLoading(false));
	}, [numHints, history, setNumHints, setHint, setLoading]);

	const handleGetSoln = useCallback(() => {
		setLoading(true);
		getFetch(`/api/v1/solve?from=${from}&to=${to}`)
			.then(res => {
				if (res.solution) {
					setSolution(res.solution);
				} else {
					// Error is for guessing, need another way to log this
					// setError('Something went wrong grabbing game words!');
				}
			})
			.then(() => setLoading(false));
	}, [setLoading, setSolution]);

	const handleSubmitEdit = useCallback(
		(nextFrom, nextTo) => {
			setNumHints(3);
			setError(null);
			onChangeGame({ from: nextFrom, to: nextTo });
			setTimer(0);
		},
		[setNumHints, setError, setTimer, onChangeGame]
	);

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
				getFetch(`/api/v1/validate?word=${guess}`).then(res => {
					if (res.success) {
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
		history,
		setWin,
		setHistory,
		setError,
		setGuessVals,
		setTimer,
	]);

	return (
		<div className={getThemeClassname('Solo', dark)}>
			<ThemeToggle />

			<StealthForm
				from={from}
				to={to}
				dark={dark}
				onChange={handleSubmitEdit}
			/>

			<div className="Solo__timer">{getFormattedTimer(timer)}</div>

			<div className={getThemeClassname('Solo__game', dark)}>
				<div className="Solo__history" aria-labelledby="soloHistory">
					<h3 id="soloHistory" className="Solo__historyLabel">
						History
					</h3>
					<ul
						className={getThemeClassname('Solo__historyList', dark)}
						aria-live="polite"
					>
						{history.map((item, i) => (
							<li key={`Solo__historyItem--${i}`}>{item}</li>
						))}
						<li ref={historyBottomRef} />
					</ul>
				</div>

				<div>
					<HintButton
						id="soloHintBtn"
						numHints={numHints}
						btnText={`Get a Hint: ${numHints}`}
						ariaLabelledBy="soloHintHeader"
						onClick={handleHintClick}
						onSolnClick={handleGetSoln}
					>
						<h3 id="soloHintHeader">Hint: </h3>
						<p className="Solo__hint">
							Recommended next word: {hint ? hint.word : ''}
						</p>
						<p className="Solo__hint">
							Estimated number of words left: {hint ? hint.numLeft : ''}
						</p>
					</HintButton>

					<div className="Solo__guessContainer">
						<h3 id="soloGuessLabel" className="Solo__guessLabel">
							Next Word:
						</h3>
						<div className="Solo__guessInputs">
							<div>
								{guessVals.map((val, i) => (
									<input
										id={'soloGuessInput-' + i}
										ref={inputRefs[i]}
										data-id={i}
										className={getThemeClassname('Solo__guessInput', dark)}
										type="text"
										maxLength={1}
										placeholder={val}
										aria-labelledby="soloGuessLabel"
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

						<div className={getThemeClassname('Solo__gameError', dark)}>
							{error}
						</div>
					</div>
				</div>
			</div>

			{loading && createPortal(<Loading />, document.body)}
			{win &&
				createPortal(
					<div className="Solo__win">
						<Confetti number={50} recycle={false} />
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
			{solution &&
				createPortal(
					<div className="Solo__solution">
						<div className="Solo__solutionContent">
							<h2 className="Solo__solutionHeader">Solution</h2>

							<ul className="Solo__solutionList">
								{solution.map((step, i) => (
									<li key={`Solo__solution-${i}`}>{step}</li>
								))}
							</ul>

							<button
								id="soloWinNewGame"
								className="Solo__winBtn"
								aria-label="New Game"
								onClick={handleNewClick}
							>
								New Game
							</button>
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

// Fun Ideas:
// - Reverse button. Work from To -> From

// TODO:
// - Check for accessibility
// 			- Missing aria?
//					- Tabbing order - When open Hint, next tab (if focus on Hint should be to Close)
//							http://webcheatsheet.com/HTML/controll_tab_order.php
//							- Perhaps same tab order of Hint button and Close button in Hint
//			- Should Loading have an Alert role?
//			- Timer accessibility ?
// - Error handling, need to figure out best way to deal with errors from the API
// - Similarly, should I improve the response check?
// - Loading component needs to be made
// - Scrollbar colour dark mode
//			- https://alligator.io/css/css-scrollbars/
// - Add styling specific to each platform (e.g. moz, etc.)
// - Solution Modal dark mode
// - Better win page
// 			- Better confetti
//			- Include more content - Stats (Time, path taken, num of words, etc), score, optimal solution
// - Figure out a better animation for the accordion-like drop down of Edit and Hint buttons
// - Constant Error strings instead of having it typed out over and over
// - Error displays for Edit (it's just an alert() right now)
// - Error displays for when Hint drop down is open and user tries to open Edit Game
