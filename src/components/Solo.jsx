import FocusTrap from 'focus-trap-react';
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
	tabBtn,
	zBtn,
} from '../constants/Keycodes';
import { getFetch } from '../functions/FetchFunctions';
import formatCentisecondsTimer from '../functions/formatCentisecondsTimer';
import getThemeClassname from '../functions/getThemeClassname';
import isOneOff from '../functions/isOneOff';
import { applyFrom, applyTo, applyGame } from '../thunk/GameThunk.jsx';

import Loading from './Loading.jsx';
import HintButton from './HintButton.jsx';
import StealthForm from './StealthForm.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import WinModal from './WinModal.jsx';

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
	const [win, setWin] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [numHints, setNumHints] = useState(3);
	const [hint, setHint] = useState(null);
	const [isHintExpanded, setIsHintExpanded] = useState(false);
	const [showHintInHistory, setShowHintInHistory] = useState(false);

	const [history, setHistory] = useState([]);
	const [guessVals, setGuessVals] = useState([]);
	const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
	const historyBottomRef = useRef(null);

	const [timer, setTimer] = useState(0);

	const [solution, setSolution] = useState(null);
	const [score, setScore] = useState(0);

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
		setHint,
		setNumHints,
		setIsHintExpanded,
		setShowHintInHistory,
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
					// num left would be all words after last history word, includes to
					// e.g. heat -> cold, hint would be head, and numLeft 4 [head, held, hold, cold]
					setHint({ word: res.hint, numLeft: res.numLeft });
					setShowHintInHistory(true);
				} else {
					// Error is for guessing, need another way to log this
					// setError('Something went wrong grabbing game words!');
				}
			})
			.then(() => setLoading(false));
	}, [
		numHints,
		history,
		setNumHints,
		setHint,
		setShowHintInHistory,
		setLoading,
	]);

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
	}, [from, to, setLoading, setSolution]);

	const handleExpandHint = useCallback(
		expand => {
			setIsHintExpanded(expand);
		},
		[setIsHintExpanded]
	);

	const handleSubmitEdit = useCallback(
		(nextFrom, nextTo) => {
			setNumHints(3);
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
					`/api/v1/score?from=${from}&to=${to}&time=${timer}&hintsUsed=${3 -
						numHints}&solution=${[...history, guess]}`
				)
					.then(res => {
						if (res) {
							setScore(res.score);
							setSolution(res.optimalSolution);
							setWin(true);
							setError(null);
							setHistory(history => [...history, guess]);
						}
					})
					.then(() => setLoading(false));
			} else {
				getFetch(`/api/v1/validate?word=${guess}`).then(res => {
					if (res.success) {
						setHistory(history => [...history, guess]);
						setError(null);
						setShowHintInHistory(false);
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
		from,
		to,
		timer,
		numHints,
		guessVals,
		history,
		setScore,
		setSolution,
		setWin,
		setError,
		setHistory,
		setLoading,
		setShowHintInHistory,
		setGuessVals,
		setTimer,
	]);

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
			{win &&
				createPortal(
					<FocusTrap>
						<div className="Solo__win">
							<Confetti number={50} recycle={false} />
							<WinModal
								dark={dark}
								from={from}
								to={to}
								playerSoln={history}
								timer={timer}
								hintsUsed={3 - numHints}
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
// - Check for accessibility - Ongoing, forever and ever
// 			- Missing aria?
// - Error handling, need to figure out best way to deal with errors from the API
// - Similarly, should I improve the response check?
// - Loading component needs to be made
// - Add styling specific to each platform (e.g. moz, etc.)
// - Solution Modal dark mode
// - Constant Error strings instead of having it typed out over and over
// - Error causes input box to be red maybe?

// https://wireframe.cc/mNTM9B
