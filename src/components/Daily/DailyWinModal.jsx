import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import Confetti from 'react-confetti';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { enterBtn } from '../../constants/Keycodes';
import formatCentisecondsTimer from '../../functions/formatCentisecondsTimer';
import getThemeClassname from '../../functions/getThemeClassname';
import hasValidCharacters from '../../functions/hasValidCharacters';
import { applyHighscore } from '../../thunk/DailyThunk.jsx';

import Modal from '../Modal.jsx';

import './DailyWinModal.less';

export const DailyWinModal = ({
	dark,
	from,
	to,
	leaderboard,
	playerSoln,
	timer,
	hintsUsed,
	score,
	hasSubmitted,
	onSubmit,
}) => {
	const [name, setName] = useState('');
	const [error, setError] = useState('');

	const handleSubmitHighscore = useCallback(() => {
		if (name.length < 4) {
			setError('Please enter a 4-letter name!');
		} else {
			onSubmit({
				name: name,
				score: score,
			});
		}
	}, [name, setError, onSubmit]);

	const handleOnChange = useCallback(
		event => {
			if (event && event.target) {
				const val = event.target.value ? event.target.value.toString() : '';
				if (hasValidCharacters(val)) {
					setName(val);
				}
			}
		},
		[setName]
	);

	const handleKeyDown = useCallback(
		event => {
			if (event && event.keyCode) {
				if (event.keyCode === enterBtn) {
					handleSubmitHighscore();
				}
			}
		},
		[name, setError, onSubmit]
	);

	const isHighscore =
		leaderboard.length > 1
			? leaderboard[leaderboard.length - 1][1] < score
			: true;

	return (
		<Modal
			dark={dark}
			name="score"
			ariaLabelledBy="dailyWinModalHeader"
			contentClassname={getThemeClassname('DailyWinModal', dark)}
			general={<Confetti number={50} recycle={false} />}
		>
			<h1 id="dailyWinModalHeader" className="DailyWinModal__header">
				Success!
			</h1>

			{isHighscore && !hasSubmitted && (
				<div>
					<fieldset className="DailyWinModal__inputs">
						<legend className="DailyWinModal__legend">New high score!!!</legend>
						<div className="DailyWinModal__inputContainer">
							<label
								className="DailyWinModal__inputLabel"
								htmlFor="dailyWinModalInput"
							>
								Name:
							</label>
							<input
								id="dailyWinModalInput"
								className={getThemeClassname('DailyWinModal__input', dark)}
								placeholder="Sock"
								value={name}
								maxLength={4}
								onChange={handleOnChange}
								onKeyDown={handleKeyDown}
							/>
						</div>
						<button
							id="dailyWinModalSubmit"
							className="DailyWinModal__highscoreSubmit"
							onClick={handleSubmitHighscore}
						>
							Submit
						</button>
					</fieldset>
					{error && (
						<div className={getThemeClassname('DailyWinModal__error', dark)}>
							{error}
						</div>
					)}
				</div>
			)}

			<section aria-labelledby="dailyWinModalStats">
				<h2 id="dailyWinModalStats">Stats:</h2>
				<ul>
					<li>
						It took you {playerSoln.length} step
						{playerSoln.length > 1 ? 's' : ''} to get from {from} to {to}!
					</li>
					<li>You spent {formatCentisecondsTimer(timer)} working on it!</li>
					<li>
						You used{' '}
						{hintsUsed === 0
							? 'no hints'
							: hintsUsed > 1
							? `${hintsUsed} hints`
							: `${hintsUsed} hint`}{' '}
						to help guide you along the way!
					</li>
				</ul>
			</section>
			<section
				aria-labelledby="dailyWinModalPlayerSoln"
				className="DailyWinModal__solution"
			>
				<h2 id="dailyWinModalPlayerSoln">Your solution:</h2>
				<ul className="DailyWinModal__solutionList">
					{playerSoln.map((word, i) => (
						<li
							className="DailyWinModal__solutionItem"
							key={`winModalPlayerSoln-${i}`}
						>
							{word}
						</li>
					))}
				</ul>
			</section>
			<section aria-labelledby="dailyWinModalScore">
				<h2 id="dailyWinModalScore">Your Score:</h2>
				<div className="DailyWinModal__score">{score}</div>
			</section>
			<span className="DailyWinModal__btn--center">
				<Link to="/">
					<button
						id="dailyWinModalHomeBtn"
						className="DailyWinModal__homeBtn"
						role="link"
					>
						Return Home
					</button>
				</Link>
			</span>
		</Modal>
	);
};

DailyWinModal.propTypes = {
	dark: PropTypes.bool,
	from: PropTypes.string,
	to: PropTypes.string,
	leaderboard: PropTypes.array,
	playerSoln: PropTypes.arrayOf(PropTypes.string),
	timer: PropTypes.number,
	hintsUsed: PropTypes.number,
	score: PropTypes.number,
	hasSubmitted: PropTypes.bool,
	onSubmit: PropTypes.func,
};

export const mapStateToProps = ({
	daily: { from, to, history, numHints, score, leaderboard, hasSubmitted },
	theme: { dark },
}) => ({
	dark,
	from,
	to,
	playerSoln: history,
	hintsUsed: 3 - numHints,
	score,
	leaderboard,
	hasSubmitted,
});

const mapDispatchToProps = {
	onSubmit: applyHighscore,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DailyWinModal);

// TODO:
// - Pull out duplicate code between this and SoloWinModal
// - Pull out duplicate styling between this and SoloWinModal
