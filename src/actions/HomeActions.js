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
