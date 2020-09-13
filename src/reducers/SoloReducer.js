import { handleActions } from 'redux-actions';

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
} from '../actions/SoloActions';

export const defaultState = {
	loading: false,
	error: null,

	from: sessionStorage.getItem('from') || '',
	to: sessionStorage.getItem('to') || '',

	guessError: null,
	history: sessionStorage.getItem('from')
		? [sessionStorage.getItem('from')]
		: [],
	hint: null,
	hintExpanded: false,
	showHintInHistory: false,
	numHints: 3,
	prevWord: sessionStorage.getItem('from') || '',

	timeStarted: null,
	score: -1,
	solution: null,
	win: false,
};

export default handleActions(
	{
		[getHintStarted]: state => ({
			...state,
			loading: true,
		}),
		[getHintSuccess]: (state, { payload }) => ({
			...state,
			loading: false,
			hint: payload,
			numHints: state.solo.numHints - 1,
			hintExpanded: true,
		}),
		[getHintFailed]: (state, { payload }) => ({
			...state,
			loading: false,
			error: payload,
		}),

		[getSolutionStarted]: state => ({
			...state,
			loading: true,
		}),
		[getSolutionSuccess]: (state, { payload }) => ({
			...state,
			loading: false,
			solution: payload,
		}),
		[getSolutionFailed]: (state, { payload }) => ({
			...state,
			loading: false,
			error: payload,
		}),

		[addGuess]: (state, { payload }) => ({
			...state,
			prevWord: payload,
			history: [...state.daily.history, payload],
			hint: null,
			hintExpanded: false,
			guessError: null,
		}),
		[setGuessError]: (state, { payload }) => ({
			...state,
			guessError: payload,
		}),

		[getScoreStarted]: state => ({
			...state,
			loading: true,
		}),
		[getScoreSuccess]: (state, { payload }) => ({
			...state,
			win: true,
			score: payload.score,
			solution: payload.optimalSolution,
		}),
		[getScoreFailed]: (state, { payload }) => ({
			...state,
			loading: false,
			error: payload,
		}),

		[getWordsStarted]: state => ({
			...state,
			loading: true,
		}),
		[getWordsSuccess]: (state, { payload }) => ({
			...defaultState,
			from: payload.from,
			to: payload.to,
			prevWord: payload.from,
			history: [payload.from],
			timeStarted: payload.timeStarted,
		}),
		[getWordsFailed]: (state, { payload }) => ({
			...state,
			loading: false,
			error: payload,
		}),

		[closeHint]: state => ({
			...state,
			hintExpanded: false,
		}),

		[editWords]: (state, { payload }) => ({
			...defaultState,
			from: payload.form,
			to: payload.to,
			prevWord: payload.from,
			history: [payload.from],
			timeStarted: payload.timeStarted,
		}),

		[editLoading]: (state, { payload }) => ({
			...state,
			loading: payload,
		}),
	},
	defaultState
);
