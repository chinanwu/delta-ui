const API_URL =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:8081'
		: 'https://api.delta.chinanwu.com';

// Handle HTTP errors since fetch won't.
const handleErrors = res => {
	if (res.ok) {
		return res;
	}

	throw Error(res.statusText);
};

// endpt: String, e.g. /api/v1/ping
const getFetch = endpt =>
	fetch(API_URL + endpt)
		.then(handleErrors)
		.then(res => res.json())
		.then(res => res)
		.catch(err => Promise.reject(err));

const putFetch = (endpt, body) =>
	fetch(API_URL + endpt, {
		method: 'PUT',
		body: body,
		headers: { 'Content-Type': 'application/json' },
	})
		.then(handleErrors)
		.then(res => res.json())
		.then(res => res)
		.catch(err => Promise.reject(err));

export const getWords = () => getFetch('/api/v1/words');

export const getSolution = (from, to, prevWord) =>
	getFetch(`/api/v1/solve?from=${from}&to=${to}&prevWord=${prevWord}`);

export const getHint = (from, to) =>
	getFetch(`/api/v1/hint?from=${from}&to=${to}`);

export const getScore = (from, to, time, numHints, history) =>
	getFetch(
		`/api/v1/score?from=${from}&to=${to}&time=${time}&hintsUsed=${3 -
			numHints}&solution=${history}`
	);

export const putHighscore = player =>
	putFetch('/api/v1/highscore', JSON.stringify(player));

export const getDailyChallenge = () => getFetch('/api/v1/dailychallenge');
