import { handleActions } from 'redux-actions';

import {
	getHintStarted,
	getHintSuccess,
	getHintFailed,
	addGuess,
	getScoreStarted,
	getScoreSuccess,
	getScoreFailed,
	setGuessError,
	closeHint,
	getDailyChallengeStarted,
	getDailyChallengeSuccess,
	getDailyChallengeFailed,
	setHighscoreSuccess,
	setHighscoreFailed,
} from '../actions/DailyActions';

export const defaultState = {
	loading: false,
	error: null,

	from: '',
	to: '',
	date: '',
	leaderboard: null,

	guessError: null,
	history: [],
	hintWord: null,
	hintNumLeft: null,
	hintExpanded: false,
	showHintInHistory: false,
	numHints: 3,
	prevWord: '',

	timeStarted: null,
	score: -1,
	win: false,
	hasSubmitted: false,
};

export default handleActions(
	{
		[getDailyChallengeStarted]: state => ({
			...state,
			loading: true,
		}),
		[getDailyChallengeSuccess]: (state, { payload }) => ({
			...defaultState,
			loading: false,
			date: payload.id,
			from: payload.from,
			to: payload.to,
			prevWord: payload.from,
			history: [payload.from],
			leaderboard: payload.leaderboard,
			timeStarted: payload.timeStarted,
		}),
		[getDailyChallengeFailed]: (state, { payload }) => ({
			...state,
			loading: false,
			error: payload,
		}),

		[getHintStarted]: state => ({
			...state,
			loading: true,
		}),
		[getHintSuccess]: (state, { payload }) => ({
			...state,
			loading: false,
			hintWord: payload.hint,
			hintNumLeft: payload.numLeft,
			numHints: state.numHints - 1,
			hintExpanded: true,
			showHintInHistory: true,
		}),
		[getHintFailed]: (state, { payload }) => ({
			...state,
			loading: false,
			error: payload,
		}),

		[addGuess]: (state, { payload }) => ({
			...state,
			prevWord: payload,
			history: [...state.history, payload],
			guessError: null,
			showHintInHistory: false,
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
		}),
		[getScoreFailed]: (state, { payload }) => ({
			...state,
			loading: false,
			error: payload,
		}),

		[closeHint]: state => ({
			...state,
			hintExpanded: false,
		}),

		// Note no reducer for started - I want the submitting of highscore to be on the DL
		[setHighscoreSuccess]: state => ({
			...state,
			hasSubmitted: true,
		}),
		[setHighscoreFailed]: (state, { payload }) => ({
			...state,
			error: payload,
		}),
	},
	defaultState
);
