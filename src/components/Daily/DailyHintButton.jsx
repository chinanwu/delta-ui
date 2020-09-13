import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { applyCloseHint, requestHint } from '../../thunk/DailyThunk.jsx';

import HintButton from '../HintButtonV2.jsx';

export const DailyHintButton = ({
	hint,
	numHints,
	isExpanded,
	error,
	onHint,
	onClose,
}) => (
	<HintButton
		id="dailyHintBtn"
		hint={hint}
		numHints={numHints}
		isExpanded={isExpanded}
		error={error}
		giveSolution={false}
		onHint={onHint}
		onClose={onClose}
	/>
);

DailyHintButton.propTypes = {
	hint: PropTypes.object,
	numHints: PropTypes.number,
	error: PropTypes.string,
	isExpanded: PropTypes.bool,
	onHint: PropTypes.func,
	onClose: PropTypes.func,
};

export const mapStateToProps = ({
	daily: { hint, numHints, hintExpanded },
}) => ({
	hint,
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
