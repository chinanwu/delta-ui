import { handleActions } from 'redux-actions';

import { editTheme } from '../actions/ThemeActions';

export const defaultState = {
	dark:
		// Not supported for Samsung Internet, Internet explorer,
		// and Firefox for Android
		window.matchMedia &&
		window.matchMedia('(prefers-color-scheme: dark)').matches,
};

export default handleActions(
	{
		[editTheme]: (state, { payload }) => ({
			...state,
			dark: payload,
		}),
	},
	defaultState
);
