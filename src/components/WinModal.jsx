import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import formatCentisecondsTimer from '../functions/formatCentisecondsTimer';

import './WinModal.less';

export const WinModal = ({
	from,
	to,
	playerSoln,
	timer,
	hintsUsed,
	score,
	solution,
}) => {
	const [showSolution, setShowSolution] = useState(false);
	const handleShowOptimal = useCallback(() => {
		setShowSolution(true);
	}, [setShowSolution]);

	return (
		<div className="WinModal">
			<h1>Success!</h1>
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
			<div>
				<h2>Your solution:</h2>
				{playerSoln.map((word, i) => (
					<span key={`WinModal__playerSoln--${i}`}>
						{i === 0
							? `${word} ->`
							: i < playerSoln.length - 1
							? ` ${word} ->`
							: ` ${word}`}
					</span>
				))}
			</div>
			<div>
				<h2>Optimal solution:</h2>
				{showSolution ? (
					solution.map((word, i) => (
						<span key={`WinModal__optimalSoln--${i}`}>
							{i === 0
								? `${word} ->`
								: i < solution.length - 1
								? ` ${word} ->`
								: ` ${word}`}
						</span>
					))
				) : (
					<button
						className="WinModal__optimalSolnBtn"
						onClick={handleShowOptimal}
					>
						Click here to reveal optimal solution
					</button>
				)}
			</div>
			<div>
				<h2>Your Score:</h2>
				<div>{score}</div>
			</div>
			<button>New game bebs!</button>
		</div>
	);
};

WinModal.propTypes = {
	from: PropTypes.string,
	to: PropTypes.string,
	playerSoln: PropTypes.arrayOf(PropTypes.string),
	timer: PropTypes.number,
	hintsUsed: PropTypes.number,
	score: PropTypes.number,
	solution: PropTypes.arrayOf(PropTypes.string),
};

export default WinModal;
