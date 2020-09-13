import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import History from '../History.jsx';

export const SoloHistory = ({ to, history, hint, win, showHint }) => (
	<History
		to={to}
		history={history}
		hintWord={hint ? hint.word : null}
		hintNumleft={hint ? hint.numLeft : null}
		win={win}
		showHint={showHint}
	/>
);

SoloHistory.propTypes = {
	to: PropTypes.string,
	history: PropTypes.arrayOf(PropTypes.string),
	hint: PropTypes.object,
	win: PropTypes.bool,
	showHint: PropTypes.bool,
};

export const mapStateToProps = ({
	solo: { to, history, hint, win, showHintInHistory },
}) => ({
	to,
	history,
	hint,
	win,
	showHint: showHintInHistory,
});

export default connect(mapStateToProps)(SoloHistory);
