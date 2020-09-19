import { words } from '../constants/words';

export default () => {
	const max = words.length;
	const fromI = Math.round(Math.random() * max);
	let toI = Math.round(Math.random() * max);

	while (fromI === toI) {
		toI = Math.round(Math.random() * max);
	}

	return { from: words[fromI], to: words[toI] };
};
