import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
	requestHint,
	requestSolution,
	applyCloseHint,
} from '../../thunk/SoloThunk.jsx';

import HintButton from '../HintButton.jsx';

export const SoloHintButton = ({
	hintWord,
	hintNumLeft,
	numHints,
	isExpanded,
	onHint,
	onSolve,
	onClose,
}) => (
	<HintButton
		id="soloHintBtn"
		hintWord={hintWord}
		hintNumLeft={hintNumLeft}
		numHints={numHints}
		isExpanded={isExpanded}
		giveSolution={true}
		onHint={onHint}
		onSolnClick={onSolve}
		onClose={onClose}
	/>
);

SoloHintButton.propTypes = {
	hintWord: PropTypes.string,
	hintNumLeft: PropTypes.number,
	numHints: PropTypes.number,
	isExpanded: PropTypes.bool,
	onHint: PropTypes.func,
	onSolve: PropTypes.func,
	onClose: PropTypes.func,
};

export const mapStateToProps = ({
	solo: { hintWord, hintNumLeft, numHints, hintExpanded },
}) => ({
	hintWord,
	hintNumLeft,
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
