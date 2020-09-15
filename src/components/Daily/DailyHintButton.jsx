import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { applyCloseHint, requestHint } from '../../thunk/DailyThunk.jsx';

import HintButton from '../HintButton.jsx';

export const DailyHintButton = ({
	hintWord,
	hintNumLeft,
	numHints,
	isExpanded,
	onHint,
	onClose,
}) => (
	<HintButton
		id="dailyHintBtn"
		hintWord={hintWord}
		hintNumLeft={hintNumLeft}
		numHints={numHints}
		isExpanded={isExpanded}
		giveSolution={false}
		onHint={onHint}
		onClose={onClose}
	/>
);

DailyHintButton.propTypes = {
	hintWord: PropTypes.string,
	hintNumLeft: PropTypes.number,
	numHints: PropTypes.number,
	isExpanded: PropTypes.bool,
	onHint: PropTypes.func,
	onClose: PropTypes.func,
};

export const mapStateToProps = ({
	daily: { hintWord, hintNumLeft, numHints, hintExpanded },
}) => ({
	hintWord,
	hintNumLeft,
	numHints,
	isExpanded: hintExpanded,
});

const mapDispatchToProps = {
	onHint: requestHint,
	onClose: applyCloseHint,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DailyHintButton);
