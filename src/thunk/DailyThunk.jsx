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
} from '../actions/DailyActions';
import { putHighscore } from '../functions/FetchFunctions';

import {
	requestHint as getHint,
	requestDailyChallenge as getDailyChallenge,
	applyGuess as setGuess,
} from './GeneralThunk.jsx';

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

	return setGuess(
		guess.toLowerCase(),
		addGuess,
		setGuessError,
		getScoreStarted,
		getScoreSuccess,
		getScoreFailed,
		daily,
		dispatch
	);
};

export const applyHighscore = player => dispatch => {
	dispatch(setHighscoreStarted());
	return putHighscore(player)
		.then(res => dispatch(setHighscoreSuccess(res)))
		.catch(e => dispatch(setHighscoreFailed(e)));
};

export const applyCloseHint = () => dispatch => dispatch(closeHint());
