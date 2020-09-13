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
import {
	ERROR_INVALID_WORD_ENTERED,
	ERROR_NOT_ONE_OFF,
} from '../constants/Errors';
import { getSolution, getWords } from '../functions/FetchFunctions';
import isOneOff from '../functions/isOneOff';
import isValidWord from '../functions/isValidWord';

import {
	requestHint as getHint,
	requestScore as getScore,
} from './RequestThunk.jsx';

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

	const valid = isValidWord(guess);
	if (isOneOff(solo.prevWord, guess) && valid) {
		// TODO: Need to check this is done in time for getScore's access to history.
		dispatch(addGuess(guess));

		if (guess === solo.to) {
			getScore(
				getScoreStarted,
				getScoreSuccess,
				getScoreFailed,
				solo,
				dispatch
			);

			// TODO: Maybe...?
			// sessionStorage.setItem('from', null);
			// sessionStorage.setItem('to', null);
		}
	} else {
		dispatch(
			setGuessError(valid ? ERROR_NOT_ONE_OFF : ERROR_INVALID_WORD_ENTERED)
		);
	}
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
		solo: { from, to },
	} = getState();
	dispatch(getSolutionStarted());
	return getSolution(from, to)
		.then(res => dispatch(getSolutionSuccess(res.solution)))
		.catch(e => dispatch(getSolutionFailed(e)));
};

export const applyCloseHint = () => dispatch => dispatch(closeHint());

export const applyWords = (from, to) => dispatch => {
	const timeStarted = new Date().getTime();
	dispatch(editWords(from, to, timeStarted));
};

export const applyLoading = loading => dispatch =>
	dispatch(editLoading(loading));

export const applyError = error => dispatch => dispatch(editError(error));

// Readings:
// https://reactgo.com/redux-fetch-data-api/
// https://daveceddia.com/where-fetch-data-redux/
