import { handleActions } from 'redux-actions';

import {
	editFrom,
	editGameUrl,
	editPlayerName,
	editTo,
} from '../actions/GameActions';

export const defaultState = {
	// from: sessionStorage.getItem('from') || '',
	// to: sessionStorage.getItem('from') || '',
	playerName: null,
};

export default handleActions(
	{
		// [editFrom]: (state, { payload }) => ({
		// 	...state,
		// 	from: payload,
		// }),
		// [editTo]: (state, { payload }) => ({
		// 	...state,
		// 	to: payload,
		// }),
		// [editGame]: (state, { payload }) => ({
		// 	...state,
		// 	from: payload.from,
		// 	to: payload.to,
		// }),
		[editPlayerName]: (state, { payload }) => ({
			...state,
			playerName: payload,
		}),
	},
	defaultState
);
