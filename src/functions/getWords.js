import { words } from '../constants/words';

export default () => {
	const fromI = Math.round(Math.random() * 10);
	let toI = Math.round(Math.random() * 10);

	while (fromI === toI) {
		toI = Math.round(Math.random() * 10);
	}

	return { from: words[fromI], to: words[toI] };
};
