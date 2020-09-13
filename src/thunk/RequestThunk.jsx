import {
	getDailyChallenge,
	getHint,
	getScore,
} from '../functions/FetchFunctions';

export const requestHint = (started, success, failed, from, to, dispatch) => {
	dispatch(started());
	return getHint(from, to)
		.then(res => dispatch(success(res.hint)))
		.catch(e => dispatch(failed(e)));
};

export const requestScore = (started, success, failed, state, dispatch) => {
	const { from, to, timeStarted, numHints, history } = state;
	const timeFinished = new Date();
	const time = (timeFinished.getTime() - timeStarted) / 1000; // in seconds

	dispatch(started());
	return getScore(from, to, time, numHints, history)
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
			const timeStarted = new Date().getTime();
			dispatch(success({ from, to, id, leaderboard, timeStarted }));
		})
		.catch(e => dispatch(failed(e)));
};
