import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';

import formatCentisecondsTimer from '../../functions/formatCentisecondsTimer';
import getThemeClassname from '../../functions/getThemeClassname';
import { getScore, requestDailyChallenge } from '../../thunk/DailyThunk.jsx';

import Error from '../Error.jsx';
import withTitle from '../HOC/withTitle.jsx';
import Loading from '../Loading.jsx';
import ThemeToggle from '../ThemeToggle.jsx';

import DailyGuess from './DailyGuess.jsx';
import DailyHintButton from './DailyHintButton.jsx';
import DailyHistory from './DailyHistory.jsx';
import DailyWinModal from './DailyWinModal.jsx';

import './Daily.less';

export const Daily = ({
	dark,
	from,
	to,
	win,
	date,
	loading,
	error,
	getDaily,
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
			getDaily();
			setTimer(0);
		}
	}, [from, to, getDaily, setTimer]);

	useEffect(() => {
		if (win) {
			onWin(timer);
			document.body.classList.add('Modal--open');
		} else {
			document.body.classList.remove('Modal--open');
		}
	}, [win, onWin, timer]);

	return (
		<div className={getThemeClassname('Daily', dark)}>
			<ThemeToggle />

			<h2 className="Daily__header">Daily Challenge</h2>
			<p className="Daily__date">For the day of {date}</p>

			<h3 className="Daily__words">
				<span className={getThemeClassname('Daily__wordLine', dark)}>
					<span className="Daily__wordLabel">From</span>{from}
				</span>
				<span className="Daily__wordArrow">-></span>
				<span className={getThemeClassname('Daily__wordLine', dark)}>
				<span className="Daily__wordLabel">To</span>{to}
				</span>
			</h3>

			<div className="Daily__timer" role="timer">
				{formatCentisecondsTimer(timer)}
			</div>

			<div className={getThemeClassname('Daily__game', dark)}>
				<DailyHistory />

				<div>
					<DailyHintButton />
					<DailyGuess />
				</div>
			</div>

			<div className="Daily__easterEgg">This is an incredibly tiny screen</div>

			{loading && createPortal(<Loading />, document.body)}
			{error && createPortal(<Error dark={dark} />, document.body)}
			{win && createPortal(<DailyWinModal timer={timer} />, document.body)}
		</div>
	);
};

Daily.propTypes = {
	dark: PropTypes.bool,
	from: PropTypes.string,
	to: PropTypes.string,
	date: PropTypes.string,
	win: PropTypes.bool,
	error: PropTypes.object,
	loading: PropTypes.bool,
	getDaily: PropTypes.func,
	onWin: PropTypes.func,
};

export const mapStateToProps = ({
	daily: { from, to, date, win, error, loading },
	theme: { dark },
}) => ({
	dark,
	from,
	to,
	date,
	win,
	error,
	loading,
});

const mapDispatchToProps = {
	getDaily: requestDailyChallenge,
	onWin: getScore,
};

export default withTitle('Daily Challenge')(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Daily)
);
