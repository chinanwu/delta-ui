import {
	getSolutionStarted,
	getSolutionSuccess,
	getSolutionFailed,
	getHintStarted,
	getHintSuccess,
	getHintFailed,
	getScoreStarted,
	getScoreSuccess,
	getScoreFailed,
	addGuess,
	setGuessError,
	closeHint,
	editWords,
	editLoading,
	editError,
	setWin,
} from '../actions/SoloActions';
import { getSolution } from '../functions/FetchFunctions';
import getWords from '../functions/getWords';

import {
	requestHint as getHint,
	applyGuess as setGuess,
	requestScore,
} from './GeneralThunk.jsx';

export const createGame = () => dispatch => {
	const { from, to } = getWords();

	sessionStorage.setItem('from', from);
	sessionStorage.setItem('to', to);

	dispatch(editWords({ from, to }));
};

export const applyGuess = guess => (dispatch, getState) => {
	const { solo } = getState();

	return setGuess(
		guess.toLowerCase(),
		addGuess,
		setGuessError,
		setWin,
		solo,
		dispatch
	);
};

export const requestHint = () => (dispatch, getState) => {
	const {
		solo: { prevWord, to },
	} = getState();
	return getHint(
		getHintStarted,
		getHintSuccess,
		getHintFailed,
		prevWord,
		to,
		dispatch
	);
};

export const requestSolution = () => (dispatch, getState) => {
	const {
		solo: { from, to, prevWord },
	} = getState();
	dispatch(getSolutionStarted());
	return getSolution(from, to, prevWord)
		.then(res => dispatch(getSolutionSuccess(res)))
		.catch(e => dispatch(getSolutionFailed(e)));
};

export const applyCloseHint = () => dispatch => dispatch(closeHint());

export const applyWords = (from, to) => dispatch => {
	sessionStorage.setItem('from', from);
	sessionStorage.setItem('to', to);

	dispatch(editWords({ from, to }));
};

export const applyLoading = loading => dispatch =>
	dispatch(editLoading(loading));

export const applyError = error => dispatch => dispatch(editError(error));

export const getScore = timer => (dispatch, getState) => {
	const { solo } = getState();

	return requestScore(
		timer,
		getScoreStarted,
		getScoreSuccess,
		getScoreFailed,
		solo,
		dispatch
	);
};

// Readings:
// https://reactgo.com/redux-fetch-data-api/
// https://daveceddia.com/where-fetch-data-redux/
