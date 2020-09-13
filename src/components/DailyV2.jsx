import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';

import formatCentisecondsTimer from '../functions/formatCentisecondsTimer';
import getThemeClassname from '../functions/getThemeClassname';
import { requestDailyChallenge } from '../thunk/DailyThunk.jsx';

import DailyGuess from './DailyGuess.jsx';
import DailyHintButton from './DailyHintButton.jsx';
import DailyHistory from './DailyHistory.jsx';
import Error from './Error.jsx';
import Loading from './Loading.jsx';
import ThemeToggle from './ThemeToggle.jsx';

import './DailyV2.less';

export const Daily = ({
	dark,
	from,
	to,
	win,
	date,
	loading,
	error,
	getDaily,
}) => {
	const [timer, setTimer] = useState(0);

	useEffect(() => {
		document.title = 'Daily Challenge - Delta';
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
		if (!from || !to) {
			getDaily();
			setTimer(0);
		}
	}, [from, to, getDaily, setTimer]);

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
				<DailyHistory />

				<div>
					<DailyHintButton />
					<DailyGuess />
				</div>
			</div>

			{loading && createPortal(<Loading />, document.body)}
			{error && createPortal(<Error />, document.body)}
		</div>
	);
};

Daily.propTypes = {
	dark: PropTypes.bool,
	from: PropTypes.string,
	to: PropTypes.string,
	date: PropTypes.string,
	win: PropTypes.bool,
	timeStarted: PropTypes.number,
	error: PropTypes.object,
	loading: PropTypes.bool,
	getDaily: PropTypes.func,
};

export const mapStateToProps = ({
	daily: { from, to, date, win, error, loading },
}) => ({
	from,
	to,
	date,
	win,
	error,
	loading,
});

const mapDispatchToProps = {
	getDaily: requestDailyChallenge,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Daily);
