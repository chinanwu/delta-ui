import { handleActions } from 'redux-actions';

import {
	editFrom,
	editGame,
	editGameUrl,
	editPlayerName,
	editTo,
} from '../actions/GameActions';

export const defaultState = {
	from: '',
	to: '',
	gameUrl: null,
	playerName: null,
};

export default handleActions(
	{
		[editFrom]: (state, { payload }) => ({
			...state,
			from: payload,
		}),
		[editTo]: (state, { payload }) => ({
			...state,
			to: payload,
		}),
		[editGame]: (state, { payload }) => ({
			...state,
			from: payload.from,
			to: payload.to,
		}),
		[editGameUrl]: (state, { payload }) => ({
			...state,
			gameUrl: payload,
		}),
		[editPlayerName]: (state, { payload }) => ({
			...state,
			playerName: payload,
		}),
	},
	defaultState
);
