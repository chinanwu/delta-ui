import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import formatCentisecondsTimer from '../../functions/formatCentisecondsTimer';
import getThemeClassname from '../../functions/getThemeClassname';
import hasValidCharacters from '../../functions/hasValidCharacters';
import { applyHighscore } from '../../thunk/DailyThunk.jsx';

import './DailyWinModal.less';

export const DailyWinModal = ({
	dark,
	from,
	to,
	playerSoln,
	timer,
	hintsUsed,
	score,
	isHighscore, // maybe move into reducer, keep it as prop given by Daily for now
	onSubmit,
}) => {
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [hasSubmitted, setHasSubmitted] = useState(false);

	const handleSubmitHighscore = useCallback(() => {
		if (name.length < 4) {
			setError('Please enter a 4-letter name!');
		} else {
			onSubmit({
				name: name,
				score: score,
			});
			setHasSubmitted(true);
		}
	}, [name, setError, onSubmit, setHasSubmitted]);

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

	return (
		<div className={getThemeClassname('DailyWinModal', dark)}>
			<h1 className="DailyWinModal__header">Success!</h1>

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

			<div>
				<h2>Stats:</h2>
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
			</div>
			<div className="DailyWinModal__solution">
				<h2>Your solution:</h2>
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
			</div>
			<div>
				<h2>Your Score:</h2>
				<div className="DailyWinModal__score">{score}</div>
			</div>
			<div className="DailyWinModal__btn--center">
				<Link to="/">
					<button
						id="dailyWinModalHomeBtn"
						className="DailyWinModal__homeBtn"
						role="link"
					>
						Return Home
					</button>
				</Link>
			</div>
		</div>
	);
};

DailyWinModal.propTypes = {
	dark: PropTypes.bool,
	from: PropTypes.string,
	to: PropTypes.string,
	playerSoln: PropTypes.arrayOf(PropTypes.string),
	timer: PropTypes.number,
	hintsUsed: PropTypes.number,
	score: PropTypes.number,
	isHighscore: PropTypes.bool,
	onSubmit: PropTypes.func,
};

export const mapStateToProps = ({
	daily: { from, to, history, numHints, score },
	theme: { dark },
}) => ({
	dark,
	from,
	to,
	playerSoln: history,
	hintsUsed: 3 - numHints,
	score,
});

const mapDispatchToProps = {
	onSubmit: applyHighscore,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DailyWinModal);

// Need to pass in timer and isHighscore