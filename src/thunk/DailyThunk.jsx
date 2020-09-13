import {
	addGuess,
	closeHint,
	getDailyChallengeFailed,
	getDailyChallengeStarted,
	getDailyChallengeSuccess,
	getHintFailed,
	getHintStarted,
	getHintSuccess,
	getScoreFailed,
	getScoreStarted,
	getScoreSuccess,
	setGuessError,
	setHighscoreFailed,
	setHighscoreStarted,
	setHighscoreSuccess,
	setTimeStarted,
} from '../actions/DailyActions';
import {
	ERROR_INVALID_WORD_ENTERED,
	ERROR_NOT_ONE_OFF,
} from '../constants/Errors';
import { putHighscore } from '../functions/FetchFunctions';
import isOneOff from '../functions/isOneOff';
import isValidWord from '../functions/isValidWord';

import {
	requestHint as getHint,
	requestScore as getScore,
	requestDailyChallenge as getDailyChallenge,
} from './RequestThunk.jsx';

export const requestDailyChallenge = () => dispatch =>
	getDailyChallenge(
		getDailyChallengeStarted,
		getDailyChallengeSuccess,
		getDailyChallengeFailed,
		dispatch
	);

export const requestHint = () => (dispatch, getState) => {
	const {
		daily: { prevWord, to },
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

export const applyGuess = guess => (dispatch, useState) => {
	const { daily } = useState();

	const valid = isValidWord(guess);
	if (isOneOff(daily.prevWord, guess) && valid) {
		// TODO: Need to check this is done in time for getScore's access to history.
		dispatch(addGuess(guess));

		if (guess === daily.to) {
			getScore(
				getScoreStarted,
				getScoreSuccess,
				getScoreFailed,
				daily,
				dispatch
			);
		}
	} else {
		dispatch(
			setGuessError(valid ? ERROR_NOT_ONE_OFF : ERROR_INVALID_WORD_ENTERED)
		);
	}
};

export const applyHighscore = player => dispatch => {
	dispatch(setHighscoreStarted());
	return putHighscore(player)
		.then(res => dispatch(setHighscoreSuccess(res)))
		.catch(e => dispatch(setHighscoreFailed(e)));
};

export const applyCloseHint = () => dispatch => dispatch(closeHint());

export const applyTimeStarted = () => dispatch => {
	const time = new Date().getTime();
	dispatch(setTimeStarted(time));
};

// TODO:
// - Do thunks always need to return the dispatch? e.g. return dispatch(...);
// 		- Based on these examples: https://gist.github.com/markerikson/ea4d0a6ce56ee479fe8b356e099f857e I do NOT think so.
