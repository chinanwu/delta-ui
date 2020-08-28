import {
	editFrom,
	editGameUrl,
	editPlayerName,
	editSolo,
	editTo,
} from '../actions/GameActions';

export const applyFrom = from => dispatch => {
	sessionStorage.setItem('from', from);
	dispatch(editFrom(from));
};
export const applyTo = to => dispatch => {
	sessionStorage.setItem('to', to);
	dispatch(editTo(to));
};

export const applyGame = words => dispatch => {
	sessionStorage.setItem('from', words.from);
	sessionStorage.setItem('to', words.to);

	dispatch(editSolo(words));
};

export const applyGameUrl = gameUrl => dispatch =>
	dispatch(editGameUrl(gameUrl));

export const applyPlayerName = playerName => dispatch =>
	dispatch(editPlayerName(playerName));
