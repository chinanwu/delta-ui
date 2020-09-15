import { createAction } from 'redux-actions';

export const getDailyChallengeStarted = createAction(
	'DAILY/GET_DAILY_CHALLENGE_STARTED'
);
export const getDailyChallengeSuccess = createAction(
	'DAILY/GET_DAILY_CHALLENGE_SUCCESS'
);
export const getDailyChallengeFailed = createAction(
	'DAILY/GET_DAILY_CHALLENGE_FAILURE'
);

export const getHintStarted = createAction('DAILY/GET_HINT_STARTED');
export const getHintSuccess = createAction('DAILY/GET_HINT_SUCCESS');
export const getHintFailed = createAction('DAILY/GET_HINT_FAILURE');

export const getScoreStarted = createAction('DAILY/GET_SCORE_STARTED');
export const getScoreSuccess = createAction('DAILY/GET_SCORE_SUCCESS');
export const getScoreFailed = createAction('DAILY/GET_SCORE_FAILURE');

export const setHighscoreStarted = createAction('DAILY/SET_HIGHSCORE_STARTED');
export const setHighscoreSuccess = createAction('DAILY/SET_HIGHSCORE_SUCCESS');
export const setHighscoreFailed = createAction('DAILY/SET_HIGHSCORE_FAILURE');

export const addGuess = createAction('DAILY/ADD_GUESS');
export const setGuessError = createAction('DAILY/SET_GUESS_ERROR');

export const closeHint = createAction('DAILY/CLOSE_HINT');

export const setWin = createAction('DAILY/SET_WIN');
