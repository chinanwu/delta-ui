import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { applyGuess } from '../thunk/DailyThunk.jsx';

import Guess from './Guess.jsx';

export const DailyGuess = ({ error, prevWord, onGuess }) => {
	return <Guess prevWord={prevWord} error={error} onGuess={onGuess} />;
};

DailyGuess.propTypes = {
	error: PropTypes.string,
};

export const mapStateToProps = ({ daily: { prevWord, guessError } }) => ({
	prevWord,
	error: guessError,
});

const mapDispatchToProps = {
	onGuess: applyGuess,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DailyGuess);
