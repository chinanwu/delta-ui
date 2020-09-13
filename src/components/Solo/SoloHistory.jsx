import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import History from '../History.jsx';

export const SoloHistory = ({
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
		hintNumLeft={hintNumLeft}
		win={win}
		showHint={showHint}
	/>
);

SoloHistory.propTypes = {
	to: PropTypes.string,
	history: PropTypes.arrayOf(PropTypes.string),
	hintWord: PropTypes.string,
	hintNumLeft: PropTypes.number,
	win: PropTypes.bool,
	showHint: PropTypes.bool,
};

export const mapStateToProps = ({
	solo: { to, history, hintWord, hintNumLeft, win, showHintInHistory },
}) => ({
	to,
	history,
	hintWord,
	hintNumLeft,
	win,
	showHint: showHintInHistory,
});

export default connect(mapStateToProps)(SoloHistory);
