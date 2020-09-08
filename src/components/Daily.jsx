import FocusTrap from 'focus-trap-react';
import React, { lazy, useCallback, useEffect, useRef, useState } from 'react';
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

const DailyWinModal = lazy(() => import('./DailyWinModal.jsx'));
import Loading from './Loading.jsx';
import HintButton from './HintButton.jsx';
import ThemeToggle from './ThemeToggle.jsx';

import './Daily.less';

const maxLen = 4;
const regex = /([a-zA-Z])/g;

export const Daily = ({ dark }) => {
	const [from, setFrom] = useState('');
	const [to, setTo] = useState('');
	const [date, setDate] = useState('');
	const [lowestHighscore, setLowestHighscore] = useState(-1);

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
		document.title = 'Daily Challenge - Delta';
	}, []);

	useEffect(() => {
		setLoading(true);
		getFetch('/api/v1/dailychallenge')
			.then(res => {
				setDate(res.id);
				setFrom(res.from);
				setTo(res.to);
				setHistory([res.from]);
				setGuessVals(res.from.match(regex));
				setLowestHighscore(res.leaderboard[res.leaderboard.length - 1].score);
			})
			.then(() => setLoading(false));
	}, [setLoading, setDate, setFrom, setTo, setLowestHighscore]);

	useEffect(() => {
		historyBottomRef.current.scrollIntoView({
			behavior: 'smooth',
		});
	}, [history]);

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

	const handleExpandHint = useCallback(
		expand => {
			setIsHintExpanded(expand);
		},
		[setIsHintExpanded]
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
					className="Daily__historyHintMysteryLi"
					key={`Daily__historyHintMystery--${i}`}
				>
					<div className="Daily__historyHintMystery">?</div>
				</li>
			);
		}
		return all;
	};

	return (
		<div className={getThemeClassname('Daily', dark)}>
			<ThemeToggle />

			<h2 className="Daily__header">Daily Challenge</h2>
			<p className="Daily__date">For the day of {date}</p>

			<h3 className="Daily__words">
				From: {from} -> To: {to}
			</h3>

			<div className="Daily__timer" role="timer">
				{formatCentisecondsTimer(timer)}
			</div>

			<div className={getThemeClassname('Daily__game', dark)}>
				<div className="Daily__history" aria-labelledby="dailyHistory">
					<h3 id="dailyHistory" className="Daily__historyLabel">
						History
					</h3>
					<ul
						className={
							getThemeClassname('Daily__historyList', dark) +
							(win ? ' Daily__historyList--hideScroll' : '')
						}
						aria-live="polite"
					>
						{history.map((item, i) => (
							<li key={`Daily__historyItem--${i}`}>{item}</li>
						))}
						<li ref={historyBottomRef} />

						{showHintInHistory && hint ? (
							hint.word !== to ? (
								<>
									<li
										className={getThemeClassname(
											'Daily__historyHintWord',
											dark
										)}
									>
										{hint.word}
									</li>
									{makeMysteryStepListItems(hint.numLeft - 2)}
									<li>{to}</li>
								</>
							) : (
								<>
									<li className="Daily__historyHintWord">{hint.word}</li>
								</>
							)
						) : null}
					</ul>
				</div>

				<div>
					<HintButton
						id="dailyHintBtn"
						numHints={numHints}
						isExpanded={isHintExpanded}
						dark={dark}
						btnText={`Get a Hint: ${numHints}`}
						ariaLabelledBy="dailyHintHeader"
						giveSolution={false}
						onClick={handleHintClick}
						onExpandChange={handleExpandHint}
					>
						<h3 id="dailyHintHeader">Hint: </h3>
						<p className="Daily__hint">
							Recommended next word: {hint ? hint.word : ''}
						</p>
						<p className="Daily__hint">
							Estimated number of words left: {hint ? hint.numLeft : ''}
						</p>
					</HintButton>

					<div className="Daily__guessContainer">
						<h3 id="dailyGuessLabel" className="Daily__guessLabel">
							Next Word:
						</h3>
						<div className="Daily__guessInputs">
							<div>
								{guessVals.map((val, i) => (
									<input
										id={'dailyGuessInput-' + i}
										ref={inputRefs[i]}
										data-id={i}
										className={getThemeClassname('Daily__guessInput', dark)}
										type="text"
										maxLength={1}
										placeholder={val}
										aria-labelledby="dailyGuessLabel"
										aria-invalid={error}
										onKeyDown={handleKeyDown}
										key={'Daily__guessInput-' + i}
									/>
								))}
							</div>

							<button
								id="dailyEnterBtn"
								className="Daily__enterBtn"
								onClick={handleEnterClick}
							>
								Enter
							</button>
						</div>

						<div className={getThemeClassname('Daily__gameError', dark)}>
							{error}
						</div>
					</div>
				</div>
			</div>

			{loading && createPortal(<Loading />, document.body)}
			{win &&
				createPortal(
					<FocusTrap>
						<div className="Daily__win">
							<Confetti number={50} recycle={false} />
							<DailyWinModal
								dark={dark}
								from={from}
								to={to}
								playerSoln={history}
								timer={timer}
								hintsUsed={3 - numHints}
								score={score}
								isHighscore={score > lowestHighscore}
							/>
						</div>
					</FocusTrap>,
					document.body
				)}
			<div className="Daily__easterEgg">This is an incredibly tiny screen</div>
		</div>
	);
};

Daily.propTypes = {
	dark: PropTypes.bool,
};

export const mapStateToProps = ({ theme: { dark } }) => ({
	dark,
});

export default connect(mapStateToProps)(Daily);

// TODO:
// - See Solo
