import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
	requestHint,
	requestSolution,
	applyCloseHint,
} from '../../thunk/SoloThunk.jsx';

import HintButton from '../HintButtonV2.jsx';

export const SoloHintButton = ({
	hint,
	numHints,
	isExpanded,
	error,
	onHint,
	onSolve,
	onClose,
}) => (
	<HintButton
		id="soloHintBtn"
		hint={hint}
		numHints={numHints}
		isExpanded={isExpanded}
		error={error}
		giveSolution={true}
		onHint={onHint}
		onSolnClick={onSolve}
		onClose={onClose}
	/>
);

SoloHintButton.propTypes = {
	hint: PropTypes.object,
	numHints: PropTypes.number,
	isExpanded: PropTypes.bool,
	error: PropTypes.string,
	onHint: PropTypes.func,
	onSolve: PropTypes.func,
	onClose: PropTypes.func,
};

export const mapStateToProps = ({
	solo: { hint, numHints, hintExpanded },
}) => ({
	hint,
	numHints,
	isExpanded: hintExpanded,
});

const mapDispatchToProps = {
	onHint: requestHint,
	onSolve: requestSolution,
	onClose: applyCloseHint,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SoloHintButton);
