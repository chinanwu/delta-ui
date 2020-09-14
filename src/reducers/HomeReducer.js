import { handleActions } from 'redux-actions';
import {
	getDailyChallengeFailed,
	getDailyChallengeStarted,
	getDailyChallengeSuccess,
} from '../actions/HomeActions';

export const defaultState = {
	loading: false,
	error: null,
	leaderboard: null,
};

export default handleActions(
	{
		[getDailyChallengeStarted]: state => ({
			...state,
			loading: true,
		}),
		[getDailyChallengeSuccess]: (state, { payload }) => ({
			...state,
			loading: false,
			leaderboard: payload.leaderboard,
		}),
		[getDailyChallengeFailed]: (state, { payload }) => ({
			...state,
			loading: false,
			error: payload,
		}),
	},
	defaultState
);

// Potential future improvements:
// - Home has it's own actions for getDaily()
