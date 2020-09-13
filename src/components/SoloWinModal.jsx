import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';

import formatCentisecondsTimer from '../functions/formatCentisecondsTimer';
import getThemeClassname from '../functions/getThemeClassname';
import { createGame } from '../thunk/SoloThunk.jsx';

import './SoloWinModal.less';

export const SoloWinModal = ({
	dark,
	from,
	to,
	playerSoln,
	timer,
	hintsUsed,
	score,
	solution,
	onNewGame,
}) => {
	const [showSolution, setShowSolution] = useState(false);
	const handleShowOptimal = useCallback(() => {
		setShowSolution(true);
	}, [setShowSolution]);

	const handleNewGame = useCallback(() => {
		onNewGame();
	}, [onNewGame]);

	return (
		<div className={getThemeClassname('SoloWinModal', dark)}>
			<h1 className="WinModal__header">Success!</h1>
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
			<div className="WinModal__solutions">
				<div className="WinModal__solution">
					<h2>Your solution:</h2>
					<ul className="WinModal__solutionList">
						{playerSoln.map((word, i) => (
							<li
								className="WinModal__solutionItem"
								key={`winModalPlayerSoln-${i}`}
							>
								{word}
							</li>
						))}
					</ul>
				</div>
				<div className="WinModal__solution" aria-live="passive">
					<h2>Optimal:</h2>
					{showSolution ? (
						<ul className="WinModal__solutionList">
							{solution.map((word, i) => (
								<li
									className="WinModal__solutionItem"
									key={`winModalOptSoln-${i}`}
								>
									{word}
								</li>
							))}
						</ul>
					) : (
						<div className="WinModal__btn--center">
							<button
								id="winModalShowSoln"
								className="WinModal__showSolnBtn"
								onClick={handleShowOptimal}
							>
								Show Solution
							</button>
						</div>
					)}
				</div>
			</div>
			<div>
				<h2>Your Score:</h2>
				<div className="WinModal__score">{score}</div>
			</div>
			<div className="WinModal__btn--center">
				<button
					id="winModalNewGame"
					className="WinModal__newBtn"
					onClick={handleNewGame}
				>
					New Game
				</button>
			</div>
		</div>
	);
};

SoloWinModal.propTypes = {
	dark: PropTypes.bool,
	from: PropTypes.string,
	to: PropTypes.string,
	playerSoln: PropTypes.arrayOf(PropTypes.string),
	timer: PropTypes.number, // passed in from Solo
	hintsUsed: PropTypes.number,
	score: PropTypes.number,
	solution: PropTypes.arrayOf(PropTypes.string),
	onNewGame: PropTypes.func,
};

export const mapStateToProps = ({
	solo: { from, to, history, numHints, score, solution },
	theme: { dark },
}) => ({
	dark,
	from,
	to,
	playerSoln: history,
	hintsUsed: 3 - numHints,
	score,
	solution,
});

const mapDispatchToProps = {
	onNewGame: createGame,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SoloWinModal);

// TODO
// Optimal solution on hover and active styling
