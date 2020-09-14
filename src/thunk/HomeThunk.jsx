import {
	getDailyChallengeFailed,
	getDailyChallengeStarted,
	getDailyChallengeSuccess,
} from '../actions/HomeActions';

import { requestDailyChallenge as getDailyChallenge } from './GeneralThunk.jsx';

export const requestDailyChallenge = () => dispatch =>
	getDailyChallenge(
		getDailyChallengeStarted,
		getDailyChallengeSuccess,
		getDailyChallengeFailed,
		dispatch
	);
