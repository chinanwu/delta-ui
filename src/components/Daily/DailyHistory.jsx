import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import History from '../History.jsx';

export const DailyHistory = ({
	to,
	history,
	hintWord,
	hintNumLeft,
	win,
	showHint,
}) => (
	<History
		to={to}
		history={history}
		hintWord={hintWord}
		hintNumleft={hintNumLeft}
		win={win}
		showHint={showHint}
	/>
);

DailyHistory.propTypes = {
	to: PropTypes.string,
	history: PropTypes.arrayOf(PropTypes.string),
	hintWord: PropTypes.string,
	hintNumLeft: PropTypes.number,
	win: PropTypes.bool,
	showHint: PropTypes.bool,
};

export const mapStateToProps = ({
	daily: { to, history, hintWord, hintNumLeft, win, showHintInHistory },
}) => ({
	to,
	history,
	hintWord,
	hintNumLeft,
	win,
	showHint: showHintInHistory,
});

export default connect(mapStateToProps)(DailyHistory);
