import {
	ERROR_INVALID_WORD_ENTERED,
	ERROR_NOT_ONE_OFF,
} from '../constants/Errors';
import {
	getDailyChallenge,
	getHint,
	getScore,
} from '../functions/FetchFunctions';
import isOneOff from '../functions/isOneOff';
import isValidWord from '../functions/isValidWord';

export const requestHint = (started, success, failed, from, to, dispatch) => {
	dispatch(started());
	return getHint(from, to)
		.then(res => dispatch(success(res)))
		.catch(e => dispatch(failed(e)));
};

export const requestScore = (
	timer,
	started,
	success,
	failed,
	state,
	dispatch
) => {
	const { from, to, numHints, history } = state;
	dispatch(started());
	return getScore(from, to, timer, numHints, history)
		.then(res => dispatch(success(res)))
		.catch(e => dispatch(failed(e)));
};

export const requestDailyChallenge = (started, success, failed, dispatch) => {
	dispatch(started());
	return getDailyChallenge()
		.then(res => {
			const leaderboard = [];
			for (let i = 0; i < res.leaderboard.length; i++) {
				leaderboard[i] = [res.leaderboard[i].name, res.leaderboard[i].score];
			}
			const { from, to, id } = res;
			dispatch(success({ from, to, id, leaderboard }));
		})
		.catch(e => dispatch(failed(e)));
};

export const applyGuess = (
	guess,
	guessAction,
	guessErrorAction,
	win,
	state,
	dispatch
) => {
	const valid = isValidWord(guess);

	if (isOneOff(state.prevWord, guess) && valid) {
		dispatch(guessAction(guess));

		if (guess === state.to) {
			dispatch(win());
		}
	} else {
		dispatch(
			guessErrorAction(valid ? ERROR_NOT_ONE_OFF : ERROR_INVALID_WORD_ENTERED)
		);
	}
};
