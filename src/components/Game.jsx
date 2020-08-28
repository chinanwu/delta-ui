import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import io from 'socket.io-client';

import {
	aBtn,
	backspaceBtn,
	enterBtn,
	leftArrowBtn,
	rightArrowBtn,
	tabBtn,
	zBtn,
} from '../constants/Keycodes';
import { getFetch } from '../functions/FetchFunctions';
import getThemeClassname from '../functions/getThemeClassname';
import hasValidCharacters from '../functions/hasValidCharacters';
import isOneOff from '../functions/isOneOff';
import { applyGameUrl } from '../thunk/GameThunk.jsx';

import Modal from './Modal.jsx';

import './Game.less';

// const URL = 'http://127.0.0.1:5000';
// const socket = io(URL);

const reg = /([a-zA-Z])/g;

export const Game = ({
	match: {
		params: { gameUrl },
	},
	dark,
	onJoin,
}) => {
	const [playerName, setPlayerName] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [from, setFrom] = useState(
		sessionStorage.getItem(gameUrl + '-from') || null
	);
	const [to, setTo] = useState(sessionStorage.getItem(gameUrl + '-to') || null);
	const [entries, setEntries] = useState([]);
	const [text, setText] = useState('');
	const [error, setError] = useState(null);
	const [win, setWin] = useState(false);
	const [messages, setMessages] = useState([]);
	const [messageText, setMessageText] = useState('');

	const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

	const inputPlaceholder = useMemo(
		() => (from ? from.match(reg) : ['', '', '', '']),
		[from]
	);

	useEffect(() => {
		document.title = 'Game - Delta';
		onJoin(gameUrl);
	}, [onJoin]);

	// useEffect(() => {
	// 	socket.on('connect', () => (!playerName ? setPlayerName(socket.id) : null));
	// }, [playerName, setPlayerName]);

	useEffect(() => {
		getFetch('/api/v1/games/getOrCreate/' + gameUrl).then(res => {
			if (res.success) {
				const from = res.data.from;
				const to = res.data.to;

				setFrom(from);
				sessionStorage.setItem(gameUrl + '-from', from);
				setEntries([from]);

				setTo(to);
				sessionStorage.setItem(gameUrl + '-to', to);
				// socket.emit('room:join', { room: gameUrl });
			}
		});

		// socket.on('words:change', data => {
		// 	setFrom(data.from);
		// 	sessionStorage.setItem(gameUrl + '-from', data.from);
		// 	setEntries([data.from]);
		//
		// 	setTo(data.to);
		// 	sessionStorage.setItem(gameUrl + '-to', data.to);
		// });
	}, [setFrom, setEntries, setTo]);

	// useEffect(() => {
	// 	socket.on('chat:message', data =>
	// 		setMessages(messages => [...messages, data.message])
	// 	);
	// }, [setMessages]);

	// useEffect(() => {
	// 	if (win) {
	// 		socket.emit('game:win', { room: gameUrl });
	// 	}
	// }, [win]);

	const handleChange = useCallback(
		event => {
			if (event && event.target) {
				const value = event.target.value;
				value
					? (setText(value),
					  hasValidCharacters(value)
							? setError(null)
							: setError('Invalid word'))
					: setText('');
			}
		},
		[setText, setError]
	);

	const handleKeyDown = useCallback(
		event => {
			if (event && event.target && event.keyCode && event.key) {
				const i = parseInt(event.target.dataset.id);
				const next = (i + 1) % 6;
				const prev = i - 1 < 0 ? 5 : i - 1;

				if (event.keyCode >= aBtn && event.keyCode <= zBtn) {
					event.preventDefault();
					inputRefs[i].current.value = event.key;
					inputRefs[next].current.focus();
					inputRefs[next].current.select();
				} else {
					switch (event.keyCode) {
						case backspaceBtn:
							event.preventDefault();
							inputRefs[i].current.value = '';
							inputRefs[prev].current.focus();
							inputRefs[prev].current.select();
							break;
						case rightArrowBtn:
							inputRefs[next].current.focus();
							inputRefs[next].current.select();
							break;
						case leftArrowBtn:
							inputRefs[prev].current.focus();
							inputRefs[prev].current.select();
							break;
						case tabBtn:
							//do nothing
							break;
						default:
							event.preventDefault();
							break;
					}
				}
			}
		},
		[inputRefs]
	);

	const handleEnterClick = useCallback(() => {
		getFetch('/api/words/validate?word=' + text).then(res => {
			if (res && isOneOff(entries[entries.length - 1], text)) {
				setEntries(entries => (entries === [] ? [text] : [...entries, text]));
				setText('');
				setError(null);
				text === to ? setWin(true) : setWin(false);
			} else {
				setError('Invalid word');
			}
		});
	}, [setEntries, setText, setWin, text, error]);

	// const handleClick = useCallback(() => {
	// 	getFetch('/api/words/validate?word=' + text).then(res => {
	// 		if (res && isOneOff(entries[entries.length - 1], text)) {
	// 			setEntries(entries => (entries === [] ? [text] : [...entries, text]));
	// 			setText('');
	// 			setError(null);
	// 			text === to ? setWin(true) : setWin(false);
	// 		} else {
	// 			setError('Invalid word');
	// 		}
	// 	});
	// }, [setEntries, setText, setWin, text, error]);

	const handleClearClick = useCallback(() => {
		setEntries([from]);
		setText('');
	}, [setEntries, from]);

	const handleNewClick = useCallback(() => {
		getFetch('/api/games/' + gameUrl + '/new').then(res => {
			const from = res.data.from;
			const to = res.data.to;

			setFrom(from);
			sessionStorage.setItem(gameUrl + '-from', from);
			setEntries([from]);

			setTo(to);
			sessionStorage.setItem(gameUrl + '-to', to);

			setWin(false);
			// socket.emit('words:change', { room: gameUrl, from: from, to: to });
		});
	}, [setFrom, setEntries, setTo, setWin]);

	const handleNameClick = useCallback(() => setShowModal(true), [setShowModal]);

	const handleChatChange = useCallback(
		event => {
			if (event && event.target) {
				const value = event.target.value;
				value ? setMessageText(value) : setMessageText('');
			}
		},
		[setMessageText]
	);

	const handleChatKeyDown = useCallback(
		event => {
			if (
				!event.shiftKey &&
				!event.ctrlKey &&
				!event.altKey &&
				!event.metaKey
			) {
				if (event.keyCode && event.keyCode === enterBtn) {
					event.preventDefault();
					setMessages(messages => [...messages, 'You: ' + messageText]);
					setMessageText('');
					// socket.emit('chat:message', {
					// 	room: gameUrl,
					// 	message: messageText,
					// 	name: playerName,
					// });
				}
			}
		},
		[messageText, playerName]
	);

	const handleChatClick = useCallback(() => {
		setMessages(messages => [...messages, 'You: ' + messageText]);
		setMessageText('');
		// socket.emit('chat:message', {
		// 	room: gameUrl,
		// 	message: messageText,
		// 	name: playerName,
		// });
	}, [setMessages, setMessageText, messageText, playerName]);

	const handleCloseModalClick = useCallback(() => {
		setShowModal(false);
	}, [setShowModal]);

	const handleModalBtnClick = useCallback(
		name => (setPlayerName(name), setShowModal(false)),
		[setPlayerName, setShowModal]
	);

	return (
		<div className={getThemeClassname('Game', dark)}>
			<h2 className="Game__words">
				From: {from} -> To: {to}
			</h2>
			<div className="Game__options">
				<p className="Game__seed">Seed: {gameUrl}</p>
				<div className="Game__btns">
					<button
						id="gameNewBtn"
						className="Game__btn"
						aria-label="New Game"
						onClick={handleNewClick}
					>
						New Game
					</button>
					<button
						id="gameChangeNameBtn"
						className="Game__btn"
						aria-label="Change Name"
						onClick={handleNameClick}
					>
						Change Name
					</button>
				</div>
			</div>
			<div className="Game__inputsContainer">
				<div className="Game__entries">{entries}</div>
				<div className="Game__letterInputsContainer">
					{inputPlaceholder.map((val, i) => (
						<input
							id={'game__letterInput-' + i}
							ref={inputRefs[i]}
							data-id={i}
							className="Game__letter"
							type="text"
							maxLength={1}
							placeholder={val}
							onKeyDown={handleKeyDown}
							key={'Game__LetterInput-' + i}
						/>
					))}

					<button
						id="gameEnterBtn"
						className="Game__enterBtn"
						onClick={handleEnterClick}
					>
						Enter
					</button>
				</div>
			</div>
			<div className={win ? 'Game__win' : 'Game__win--hidden'}>You've won!</div>
			{showModal &&
				createPortal(
					<Modal
						title="Change Player Name"
						btnText="Submit"
						onBtnClick={handleModalBtnClick}
						onCloseModalClick={handleCloseModalClick}
					/>,
					document.body
				)}
		</div>
	);
};

Game.propTypes = {
	match: PropTypes.object,
	dark: PropTypes.bool,
	onJoin: PropTypes.func,
};

export const mapStateToProps = ({ theme: { dark } }) => ({
	dark,
});

const mapDispatchToProps = {
	onJoin: applyGameUrl,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Game);

//
// {
// 	/*<Chat*/
// }
// {
// 	/*messages={messages}*/
// }
// {
// 	/*text={messageText}*/
// }
// {
// 	/*onChange={handleChatChange}*/
// }
// {
// 	/*onKeyDown={handleChatKeyDown}*/
// }
// {
// 	/*onClick={handleChatClick}*/
// }
// {
// 	/*/>*/
// }
