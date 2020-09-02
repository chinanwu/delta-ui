export default timer => {
	let centis = timer;
	const minutes = Math.floor(centis / 6000);
	centis = centis - 6000 * minutes;
	const seconds = Math.floor(centis / 100);
	centis = centis - 100 * seconds;

	return `${minutes < 10 ? '0' + minutes : minutes}m : ${
		seconds < 10 ? '0' + seconds : seconds
	}s : ${centis < 10 ? '0' + centis : centis}cs`;
};
