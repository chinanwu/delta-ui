import { createAction } from 'redux-actions';

export const getHintStarted = createAction('SOLO/GET_HINT_STARTED');
export const getHintSuccess = createAction('SOLO/GET_HINT_SUCCESS');
export const getHintFailed = createAction('SOLO/GET_HINT_FAILURE');

export const getScoreStarted = createAction('SOLO/GET_SCORE_STARTED');
export const getScoreSuccess = createAction('SOLO/GET_SCORE_SUCCESS');
export const getScoreFailed = createAction('SOLO/GET_SCORE_FAILURE');

export const getSolutionStarted = createAction('SOLO/GET_SOLUTION_STARTED');
export const getSolutionSuccess = createAction('SOLO/GET_SOLUTION_SUCCESS');
export const getSolutionFailed = createAction('SOLO/GET_SOLUTION_FAILURE');

export const getWordsStarted = createAction('SOLO/GET_WORDS_STARTED');
export const getWordsSuccess = createAction('SOLO/GET_WORDS_SUCCESS');
export const getWordsFailed = createAction('SOLO/GET_WORDS_FAILURE');

export const addGuess = createAction('SOLO/ADD_GUESS');
export const setGuessError = createAction('SOLO/SET_GUESS_ERROR');

export const closeHint = createAction('SOLO/CLOSE_HINT');

export const editWords = createAction('SOLO/EDIT_WORDS');

export const editLoading = createAction('SOLO/EDIT_LOADING');
export const editError = createAction('SOLO/EDIT_ERROR');

export const setWin = createAction('SOLO/SET_WIN');

//https://daveceddia.com/where-fetch-data-redux/
