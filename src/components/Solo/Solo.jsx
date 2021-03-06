import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';

import formatCentisecondsTimer from '../../functions/formatCentisecondsTimer';
import getThemeClassname from '../../functions/getThemeClassname';
import { applyWords, createGame, getScore } from '../../thunk/SoloThunk.jsx';

import Error from '../Error.jsx';
import withTitle from '../HOC/withTitle.jsx';
import Loading from '../Loading.jsx';
import ThemeToggle from '../ThemeToggle.jsx';

import SoloGuess from './SoloGuess.jsx';
import SoloHintButton from './SoloHintButton.jsx';
import SoloHistory from './SoloHistory.jsx';
import SoloWinModal from './SoloWinModal.jsx';
import SolutionModal from './SolutionModal.jsx';
import StealthForm from './StealthForm.jsx';

import './Solo.less';

export const Solo = ({
	dark,
	from,
	to,
	win,
	solution,
	error,
	loading,
	onNewGame,
	onChangeWords,
	onWin,
}) => {
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
		if (!from || !to) {
			onNewGame();
			setTimer(0);
		}
	}, [from, to, onNewGame, setTimer]);

	useEffect(() => {
		if (win) {
			onWin(timer);
			document.body.classList.add('Modal--open');
		} else {
			document.body.classList.remove('Modal--open');
		}
	}, [win, onWin, timer]);

	const handleEditWords = useCallback(
		(from, to) => {
			onChangeWords(from, to);
			setTimer(0);
		},
		[onChangeWords, setTimer]
	);

	return (
		<div className={getThemeClassname('Solo', dark)}>
			<ThemeToggle />
			<StealthForm onChange={handleEditWords} />

			<div className="Solo__timer" role="timer">
				{formatCentisecondsTimer(timer)}
			</div>

			<div className={getThemeClassname('Solo__game', dark)}>
				<SoloHistory />

				<div>
					<SoloHintButton />
					<SoloGuess />
				</div>
			</div>

			<div className="Solo__easterEgg">This is an incredibly tiny screen</div>

			{loading && createPortal(<Loading />, document.body)}
			{error && createPortal(<Error dark={dark} />, document.body)}
			{win && createPortal(<SoloWinModal timer={timer} />, document.body)}
			{solution && !win && createPortal(<SolutionModal />, document.body)}
		</div>
	);
};

Solo.propTypes = {
	dark: PropTypes.bool,
	from: PropTypes.string,
	to: PropTypes.string,
	win: PropTypes.bool,
	solution: PropTypes.arrayOf(PropTypes.string),
	error: PropTypes.object,
	loading: PropTypes.bool,
	onNewGame: PropTypes.func,
	onChangeWords: PropTypes.func,
	onWin: PropTypes.func,
};

export const mapStateToProps = ({
	solo: { from, to, win, solution, error, loading },
	theme: { dark },
}) => ({
	dark,
	from,
	to,
	win,
	solution,
	error,
	loading,
});

const mapDispatchToProps = {
	onNewGame: createGame,
	onChangeWords: applyWords,
	onWin: getScore,
};

export default withTitle('Play')(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Solo)
);

// TODO:
// - Implemenet use of WinModal and Solution here
