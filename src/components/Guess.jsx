import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import {
	aBtn,
	backspaceBtn,
	enterBtn,
	leftArrowBtn,
	rightArrowBtn,
	tabBtn,
	zBtn,
} from '../constants/Keycodes';
import getThemeClassname from '../functions/getThemeClassname';

import './Guess.less';

const maxLen = 4;
const regex = /([a-zA-Z])/g;

export const Guess = ({ dark, prevWord, error, onGuess }) => {
	const [guessVals, setGuessVals] = useState(['.', '.', '.', '.']);
	const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

	useEffect(() => {
		setGuessVals(prevWord.match(regex));
	}, [prevWord]);

	const handleKeyDown = useCallback(
		event => {
			if (
				event &&
				event.target &&
				event.keyCode &&
				event.key &&
				!event.ctrlKey &&
				!event.altKey &&
				!event.metaKey
			) {
				const i = parseInt(event.target.dataset.id);
				const next = (i + 1) % maxLen;
				const prev = i - 1 < 0 ? maxLen - 1 : i - 1;

				if (event.keyCode >= aBtn && event.keyCode <= zBtn) {
					event.preventDefault();
					inputRefs[i].current.value = event.key;
					if (next >= i) {
						inputRefs[next].current.focus();
						inputRefs[next].current.select();
					}
				} else {
					switch (event.keyCode) {
						case enterBtn:
							event.preventDefault();
							handleEnterClick();
							inputRefs[0].current.focus();
							break;
						case backspaceBtn:
							event.preventDefault();
							inputRefs[i].current.value = '';
							if (prev <= i) {
								inputRefs[prev].current.focus();
								inputRefs[prev].current.select();
							}
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
		let guess = '';
		inputRefs.forEach((inputRef, i) => {
			if (inputRef.current.value !== '') {
				guess = guess + inputRef.current.value;
				inputRef.current.value = '';
			} else {
				guess = guess + prevWord[i];
			}
		});

		onGuess(guess);
	}, [inputRefs, onGuess]);

	return (
		<div className="Guess">
			<h3 id="guessLabel" className="Guess__label">
				Next Word:
			</h3>
			<div className="Guess__inputs">
				<div>
					{guessVals &&
						guessVals.map((val, i) => (
							<input
								id={'guessInput_' + i}
								ref={inputRefs[i]}
								data-id={i}
								className={getThemeClassname('Guess__input', dark)}
								type="text"
								maxLength={1}
								placeholder={val}
								aria-labelledby="guessLabel"
								aria-invalid={error}
								onKeyDown={handleKeyDown}
								key={'guessInput-' + i}
							/>
						))}
				</div>

				<button
					id="guessEnterBtn"
					className="Guess__enterBtn"
					onClick={handleEnterClick}
				>
					Enter
				</button>
			</div>

			<div
				className={getThemeClassname('Guess__error', dark)}
				aria-live="passive"
			>
				{error}
			</div>
		</div>
	);
};

export const mapStateToProps = ({ theme: { dark } }) => ({
	dark,
});

Guess.propTypes = {
	dark: PropTypes.bool,
	prevWord: PropTypes.string,
	onGuess: PropTypes.func,
};

export default connect(mapStateToProps)(Guess);
