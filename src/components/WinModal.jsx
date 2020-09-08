import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import formatCentisecondsTimer from '../functions/formatCentisecondsTimer';
import getThemeClassname from '../functions/getThemeClassname';

import './WinModal.less';

export const WinModal = ({
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
		<div className={getThemeClassname('WinModal', dark)}>
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

WinModal.propTypes = {
	dark: PropTypes.bool,
	from: PropTypes.string,
	to: PropTypes.string,
	playerSoln: PropTypes.arrayOf(PropTypes.string),
	timer: PropTypes.number,
	hintsUsed: PropTypes.number,
	score: PropTypes.number,
	solution: PropTypes.arrayOf(PropTypes.string),
	onNewGame: PropTypes.func,
};

export default WinModal;

// TODO
// Optimal solution on hover and active styling

// add bing to word list
