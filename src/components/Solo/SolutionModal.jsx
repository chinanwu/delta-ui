import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { createGame } from '../../thunk/SoloThunk.jsx';

import Modal from '../Modal.jsx';

import './SolutionModal.less';

const makeSolutionToPlayerArr = (history, solutionToPlayer) => {
	if (history.length === 1) {
		return solutionToPlayer;
	} else {
		history.pop();
		return history.concat(solutionToPlayer);
	}
};

export const SolutionModal = ({
	dark,
	solution,
	history,
	solutionToPlayer,
	onNewGame,
}) => {
	const handleNewGame = useCallback(() => {
		onNewGame();
	}, [onNewGame]);

	return (
		<Modal
			dark={dark}
			name="solution"
			ariaLabelledBy="solutionHeader"
			contentClassname="SolutionModal"
		>
			<h1 id="solutionHeader">Solution</h1>

			<div className="SolutionModal__solutions">
				<span className="SolutionModal__solution">
					<h2 id="solutionOptimal">Optimal:</h2>
					<ul className="SolutionModal__list" aria-labelledby="solutionOptimal">
						{solution.map((step, i) => (
							<li key={`SolutionModal__list-${i}`}>{step}</li>
						))}
					</ul>
				</span>

				<span className="SolutionModal__solution">
					<h2 id="solutionPlayer">Your approach:</h2>
					<ul className="SolutionModal__list" aria-labelledby="solutionPlayer">
						{makeSolutionToPlayerArr(history, solutionToPlayer).map(
							(step, i) => (
								<li key={`Solo__playerSolution-${i}`}>{step}</li>
							)
						)}
					</ul>
				</span>
			</div>

			<button
				id="solutionNewGameBtn"
				className="SolutionModal__newBtn"
				onClick={handleNewGame}
			>
				New Game
			</button>
		</Modal>
	);
};

SolutionModal.propTypes = {
	dark: PropTypes.bool,
	solution: PropTypes.arrayOf(PropTypes.string),
	history: PropTypes.arrayOf(PropTypes.string),
	solutionToPlayer: PropTypes.arrayOf(PropTypes.string),
	onNewGame: PropTypes.func,
};

export const mapStateToProps = ({
	solo: { solution, history, solutionToPlayer },
	theme: { dark },
}) => ({
	dark,
	solution,
	history,
	solutionToPlayer,
});

const mapDispatchToProps = {
	onNewGame: createGame,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SolutionModal);
