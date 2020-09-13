import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { applyGuess } from '../thunk/SoloThunk.jsx';

import Guess from './Guess.jsx';

export const SoloGuess = ({ prevWord, error, onGuess }) => (
	<Guess prevWord={prevWord} error={error} onGuess={onGuess} />
);

SoloGuess.propTypes = {
	prevWord: PropTypes.string,
	error: PropTypes.string,
	onGuess: PropTypes.func,
};

export const mapStateToProps = ({ solo: { prevWord, guessError } }) => ({
	prevWord,
	error: guessError,
});

const mapDispatchToProps = {
	onGuess: applyGuess,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SoloGuess);
