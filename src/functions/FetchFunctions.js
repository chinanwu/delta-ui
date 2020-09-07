const API_URL =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:8081'
		: 'http://api.delta.chinanwu.com';

// endpt: String, e.g. /api/v1/ping
export const getFetch = endpt =>
	fetch(API_URL + endpt)
		.then(res => res.json())
		.then(res => res)
		.catch(err => err);

// endpt: string, e.g. /api/v1/pong
// body: string
export const postFetch = (endpt, body) =>
	fetch(API_URL + endpt, {
		method: 'POST',
		body: body,
		headers: { 'Content-Type': 'application/json' },
	})
		.then(res => res.json())
		.then(res => res)
		.catch(err => err);

export const putFetch = (endpt, body) =>
	fetch(API_URL + endpt, {
		method: 'PUT',
		body: body,
		headers: { 'Content-Type': 'application/json' },
	})
		.then(res => res.json())
		.then(res => res)
		.catch(err => err);
