import FocusTrap from 'focus-trap-react';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { ERROR_NOT_ONE_OFF, ERROR_NOT_REAL_WORD } from '../../constants/Errors';

import {
	aBtn,
	backspaceBtn,
	enterBtn,
	leftArrowBtn,
	rightArrowBtn,
	tabBtn,
	zBtn,
} from '../../constants/Keycodes';
import { getFetch } from '../../functions/FetchFunctions';
import formatCentisecondsTimer from '../../functions/formatCentisecondsTimer';
import getThemeClassname from '../../functions/getThemeClassname';
import isOneOff from '../../functions/isOneOff';
import isValidWord from '../../functions/isValidWord';
import { applyFrom, applyTo, applyGame } from '../../thunk/SoloThunk.jsx';

import Error from '../Error.jsx';
import Loading from '../Loading.jsx';
import HintButton from '../HintButton.jsx';
import StealthForm from './StealthForm.jsx';
import ThemeToggle from '../ThemeToggle.jsx';
import SoloWinModal from './SoloWinModal.jsx';

import './Solo.less';

const maxLen = 4;
const regex = /([a-zA-Z])/g;
const totalHints = 3;

const makeMysteryStepListItems = num => {
	let all = [];
	for (let i = 0; i < num; i++) {
		all[i] = (
			<li
				className="Solo__historyHintMysteryLi"
				key={`Solo__historyHintMystery--${i}`}
			>
				<div className="Solo__historyHintMystery">?</div>
			</li>
		);
	}
	return all;
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
	const [apiError, setApiError] = useState(false);

	const [numHints, setNumHints] = useState(totalHints);
	const [hint, setHint] = useState(null);
	const [isHintExpanded, setIsHintExpanded] = useState(false);
	const [showHintInHistory, setShowHintInHistory] = useState(false);

	const [history, setHistory] = useState([]);
	const [guessVals, setGuessVals] = useState(['.', '.', '.', '.']);
	const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
	const historyBottomRef = useRef(null);

	const [timer, setTimer] = useState(0);

	const [solution, setSolution] = useState(null);
	const [score, setScore] = useState(0);

	useEffect(() => {
		document.title = 'Play - Delta';
	}, []);

	useEffect(() => {
		let interval = null;
		if (!win && !loading) {
			interval = setInterval(() => {
				setTimer(seconds => seconds + 1);
			}, 10);
		}
		return () => clearInterval(interval);
	}, [timer, win]);

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
						setApiError(true);
					}
				})
				.then(() => setLoading(false))
				.catch(() => setApiError(true));
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
		setApiError,
	]);

	useEffect(() => {
		historyBottomRef.current.scrollIntoView({
			behavior: 'smooth',
		});
	}, [history, historyBottomRef]);

	const handleNewClick = useCallback(() => {
		setWin(false);
		setNumHints(totalHints);
		setHint(null);
		setIsHintExpanded(false);
		setShowHintInHistory(false);
		setError(null);
		setTimer(0);
		setSolution(null);

		inputRefs.forEach(inputRef => {
			inputRef.current.value = '';
		});
		setLoading(true);
		getFetch('/api/v1/words')
			.then(res => {
				if (res.from && res.to) {
					onChangeGame({ from: res.from, to: res.to });
					setHistory([res.from]);
					setGuessVals(res.from.match(regex));
				} else {
					setApiError(true);
				}
			})
			.then(() => setLoading(false))
			.catch(() => setApiError(true));
	}, [
		setWin,
		setNumHints,
		setHint,
		setIsHintExpanded,
		setShowHintInHistory,
		setError,
		setTimer,
		setSolution,
		inputRefs,
		setLoading,
		onChangeGame,
		setHistory,
		setGuessVals,
		setApiError,
	]);

	const handleHintClick = useCallback(() => {
		setLoading(true);
		getFetch(`/api/v1/hint?from=${history[history.length - 1]}&to=${to}`)
			.then(res => {
				if (res.hint && (res.numLeft === 0 || res.numLeft !== null)) {
					setNumHints(numHints => numHints - 1);
					// num left would be all words after last history word, includes to
					// e.g. heat -> cold, hint would be head, and numLeft 4 [head, held, hold, cold]
					setHint({ word: res.hint, numLeft: res.numLeft });
					setShowHintInHistory(true);
				} else {
					setApiError(true);
				}
			})
			.then(() => setLoading(false))
			.catch(() => setApiError(true));
	}, [
		to,
		numHints,
		history,
		setNumHints,
		setHint,
		setShowHintInHistory,
		setLoading,
		setApiError,
	]);

	const handleGetSoln = useCallback(() => {
		setLoading(true);
		getFetch(`/api/v1/solve?from=${from}&to=${to}`)
			.then(res => {
				if (res.solution) {
					setSolution(res.solution);
				} else {
					setApiError(true);
				}
			})
			.then(() => setLoading(false))
			.catch(() => setApiError(true));
	}, [from, to, setLoading, setSolution, setApiError]);

	const handleExpandHint = useCallback(
		expand => {
			setIsHintExpanded(expand);
		},
		[setIsHintExpanded]
	);

	const handleSubmitEdit = useCallback(
		(nextFrom, nextTo) => {
			setNumHints(totalHints);
			setHint(null);
			setIsHintExpanded(false);
			setShowHintInHistory(false);
			setError(null);
			onChangeGame({ from: nextFrom, to: nextTo });
			setTimer(0);
		},
		[
			setNumHints,
			setHint,
			setIsHintExpanded,
			setShowHintInHistory,
			setError,
			setTimer,
			onChangeGame,
		]
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
				setLoading(true);
				getFetch(
					`/api/v1/score?from=${from}&to=${to}&time=${timer}&hintsUsed=${totalHints -
						numHints}&solution=${[...history, guess]}`
				)
					.then(res => {
						if (res) {
							setScore(res.score);
							setSolution(res.optimalSolution);
							setWin(true);
							setError(null);
							setHistory(history => [...history, guess]);
						} else {
							setApiError(true);
						}
					})
					.then(() => setLoading(false))
					.catch(() => setApiError(true));
			} else {
				if (isValidWord(guess)) {
					setHistory(history => [...history, guess]);
					setError(null);
					setShowHintInHistory(false);
				} else {
					setGuessVals(history[history.length - 1].match(regex));
					setError(ERROR_NOT_REAL_WORD);
				}
			}
		} else {
			setGuessVals(history[history.length - 1].match(regex));
			setError(ERROR_NOT_ONE_OFF);
		}
	}, [
		from,
		to,
		timer,
		numHints,
		guessVals,
		inputRefs,
		history,
		setScore,
		setSolution,
		setWin,
		setError,
		setHistory,
		setApiError,
		setLoading,
		setShowHintInHistory,
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

			<div className="Solo__timer" role="timer">
				{formatCentisecondsTimer(timer)}
			</div>

			<div className={getThemeClassname('Solo__game', dark)}>
				<div className="Solo__history" aria-labelledby="soloHistory">
					<h3 id="soloHistory" className="Solo__historyLabel">
						History
					</h3>
					<ul
						className={
							getThemeClassname('Solo__historyList', dark) +
							(win ? ' Solo__historyList--hideScroll' : '')
						}
						aria-live="polite"
					>
						{history.map((item, i) => (
							<li key={`Solo__historyItem--${i}`}>{item}</li>
						))}
						<li ref={historyBottomRef} />

						{showHintInHistory && hint ? (
							hint.word !== to ? (
								<>
									<li
										className={getThemeClassname('Solo__historyHintWord', dark)}
									>
										{hint.word}
									</li>
									{makeMysteryStepListItems(hint.numLeft - 2)}
									<li>{to}</li>
								</>
							) : (
								<>
									<li className="Solo__historyHintWord">{hint.word}</li>
								</>
							)
						) : null}
					</ul>
				</div>

				<div>
					<HintButton
						id="soloHintBtn"
						numHints={numHints}
						isExpanded={isHintExpanded}
						dark={dark}
						btnText={`Get a Hint: ${numHints}`}
						ariaLabelledBy="soloHintHeader"
						giveSolution={true}
						onClick={handleHintClick}
						onSolnClick={handleGetSoln}
						onExpandChange={handleExpandHint}
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
								{guessVals &&
									guessVals.map((val, i) => (
										<input
											id={'soloGuessInput-' + i}
											ref={inputRefs[i]}
											data-id={i}
											className={getThemeClassname('Solo__guessInput', dark)}
											type="text"
											maxLength={1}
											placeholder={val}
											aria-labelledby="soloGuessLabel"
											aria-invalid={error}
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
			{apiError && createPortal(<Error />, document.body)}
			{win &&
				createPortal(
					<FocusTrap>
						<div className="Solo__win">
							<Confetti number={50} recycle={false} />
							<SoloWinModal
								dark={dark}
								from={from}
								to={to}
								playerSoln={history}
								timer={timer}
								hintsUsed={totalHints - numHints}
								score={score}
								solution={solution}
								onNewGame={handleNewClick}
							/>
						</div>
					</FocusTrap>,
					document.body
				)}
			{solution &&
				createPortal(
					<div className="Solo__solution">
						<div className={getThemeClassname('Solo__solutionContent', dark)}>
							<h2 className="Solo__solutionHeader">Solution</h2>

							<ul className="Solo__solutionList">
								{solution.map((step, i) => (
									<li key={`Solo__solution-${i}`}>{step}</li>
								))}
							</ul>

							<button
								id="soloSolnNewGame"
								className="Solo__newBtn"
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

// Potential future improvements:
// - Check for accessibility - Ongoing, forever and ever
// - Reverse button. Work from To -> From
// - Rule refresher under the game
// - Error causes input box to be red maybe?

// TODO:
// - Add styling specific to each platform (e.g. moz, etc.)

// https://wireframe.cc/mNTM9B
