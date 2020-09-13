import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';

import formatCentisecondsTimer from '../functions/formatCentisecondsTimer';
import getThemeClassname from '../functions/getThemeClassname';
import { applyWords, createGame } from '../thunk/SoloThunk.jsx';

import Error from './Error.jsx';
import Loading from './Loading.jsx';
import SoloGuess from './SoloGuess.jsx';
import SoloHintButton from './SoloHintButton.jsx';
import SoloHistory from './SoloHistory.jsx';
import StealthForm from './StealthForm.jsx';
import ThemeToggle from './ThemeToggle.jsx';

import './SoloV3.less';

export const Solo = ({
	dark,
	from,
	to,
	win,
	error,
	loading,
	onNewGame,
	onChangeWords,
}) => {
	const [timer, setTimer] = useState(0);

	useEffect(() => {
		document.title = 'Play - Delta';
	}, []);

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
		if (!from && !to) {
			onNewGame();
			setTimer(0);
		}
	}, [from, to, onNewGame, setTimer]);

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
			{error && createPortal(<Error />, document.body)}
		</div>
	);
};

Solo.propTypes = {
	dark: PropTypes.bool,
	from: PropTypes.string,
	to: PropTypes.string,
	win: PropTypes.bool,
	error: PropTypes.object,
	loading: PropTypes.bool,
	onNewGame: PropTypes.func,
	onChangeWords: PropTypes.func,
};

export const mapStateToProps = ({
	solo: { from, to, win, error, loading },
	theme: { dark },
}) => ({
	dark,
	from,
	to,
	win,
	error,
	loading,
});

const mapDispatchToProps = {
	onNewGame: createGame,
	onChangeWords: applyWords,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Solo);
