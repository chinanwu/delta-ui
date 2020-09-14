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
	getWordsStarted,
	getWordsSuccess,
	getWordsFailed,
	closeHint,
	editWords,
	editLoading,
	editError,
} from '../actions/SoloActions';
import { getSolution, getWords } from '../functions/FetchFunctions';

import {
	requestHint as getHint,
	applyGuess as setGuess,
} from './GeneralThunk.jsx';

export const createGame = () => dispatch => {
	dispatch(getWordsStarted());
	return getWords()
		.then(res => {
			const from = res.from;
			const to = res.to;

			sessionStorage.setItem('from', from);
			sessionStorage.setItem('to', to);

			dispatch(
				getWordsSuccess({
					from: from,
					to: to,
					timeStarted: new Date().getTime(),
				})
			);
		})
		.catch(e => dispatch(getWordsFailed(e)));
};

export const applyGuess = guess => (dispatch, useState) => {
	const { solo } = useState();

	return setGuess(
		guess,
		addGuess,
		setGuessError,
		getScoreStarted,
		getScoreSuccess,
		getScoreFailed,
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
	const timeStarted = new Date().getTime();
	dispatch(editWords({ from, to, timeStarted }));
};

export const applyLoading = loading => dispatch =>
	dispatch(editLoading(loading));

export const applyError = error => dispatch => dispatch(editError(error));

// Readings:
// https://reactgo.com/redux-fetch-data-api/
// https://daveceddia.com/where-fetch-data-redux/
