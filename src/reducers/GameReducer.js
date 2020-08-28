import { handleActions } from 'redux-actions';

import {
	editFrom,
	editPlayerName,
	editSolo,
	editTo,
} from '../actions/GameActions';

export const defaultState = {
	solo: {
		from: sessionStorage.getItem('from') || '',
		to: sessionStorage.getItem('to') || '',
	},
	playerName: null,
};

export default handleActions(
	{
		[editFrom]: (state, { payload }) => ({
			...state,
			solo: { from: payload, to: state.solo.to },
		}),
		[editTo]: (state, { payload }) => ({
			...state,
			solo: { from: state.solo.from, to: payload },
		}),
		[editSolo]: (state, { payload }) => ({
			...state,
			solo: { from: payload.from, to: payload.to },
		}),
		[editPlayerName]: (state, { payload }) => ({
			...state,
			playerName: payload,
		}),
	},
	defaultState
);
