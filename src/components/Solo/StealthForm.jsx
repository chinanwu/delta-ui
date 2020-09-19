import FocusTrap from 'focus-trap-react';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';

import { ERROR_INVALID_WORDS_ENTERED } from '../../constants/Errors';
import { enterBtn, escapeBtn, spaceBtn } from '../../constants/Keycodes';
import getThemeClassname from '../../functions/getThemeClassname';
import getWords from '../../functions/getWords';
import hasValidCharacters from '../../functions/hasValidCharacters';
import isValidWord from '../../functions/isValidWord';

import './StealthForm.less';

export const StealthForm = ({ dark, from, to, onChange }) => {
	const [isEditable, setIsEditable] = useState(false);
	const [fromVal, setFromVal] = useState('');
	const [toVal, setToVal] = useState('');
	const [error, setError] = useState('');

	const handleOpen = useCallback(() => {
		setIsEditable(true);
	}, [setIsEditable]);

	const handleClose = useCallback(() => {
		setIsEditable(false);
		setFromVal('');
		setToVal('');
		setError('');
	}, [setIsEditable, setFromVal, setToVal, setError]);

	const handleCancelClick = useCallback(() => {
		handleClose();
	}, [setIsEditable, setFromVal, setToVal, setError]);

	const handleFromChange = useCallback(
		event => {
			if (event && event.target) {
				const val = event.target.value
					? event.target.value.toString().toLowerCase()
					: '';
				if (hasValidCharacters(val)) setFromVal(val);
			}
		},
		[setFromVal]
	);

	const handleToChange = useCallback(
		event => {
			if (event && event.target) {
				const val = event.target.value
					? event.target.value.toString().toLowerCase()
					: '';
				if (hasValidCharacters(val)) setToVal(val);
			}
		},
		[setToVal]
	);

	const handleKeyDown = useCallback(
		event => {
			if (event && event.keyCode) {
				if (event.keyCode === enterBtn || event.keyCode === spaceBtn) {
					event.preventDefault();
					handleSubmitClick();
				} else if (event.keyCode === escapeBtn) {
					handleCancelClick();
				}
			}
		},
		[fromVal, toVal, setIsEditable, setFromVal, setToVal, setError, onChange]
	);

	const handleRandomizeClick = useCallback(() => {
		const { from, to } = getWords();
		setFromVal(from);
		setToVal(to);
		setError('');
	}, [setFromVal, setToVal, setError]);

	const handleSubmitClick = useCallback(() => {
		if (isValidWord(fromVal) && isValidWord(toVal)) {
			onChange(fromVal, toVal);
			handleClose();
		} else {
			setError(ERROR_INVALID_WORDS_ENTERED);
		}
	}, [fromVal, toVal, setIsEditable, setFromVal, setToVal, setError, onChange]);

	return (
		<div className="StealthForm">
			<button
				id="stealthFormEditBtn"
				className={
					'StealthForm__btn StealthForm__editBtn' +
					(isEditable && dark ? ' StealthForm__editBtn--disabled--dark' : '')
				}
				aria-roledescription="Modify the game words"
				disabled={isEditable}
				onClick={handleOpen}
			>
				Edit
			</button>
			<FocusTrap active={isEditable}>
				<div
					className={
						'StealthForm__form' +
						(isEditable
							? getThemeClassname(' StealthForm--editable', dark)
							: '')
					}
				>
					{isEditable && <h2 className="StealthForm__editHeader">Edit Game</h2>}
					<h3 className={'StealthForm__words'}>
						<span
							className={
								'StealthForm__wordLine' +
								(isEditable
									? ' StealthForm__wordLine--editable'
									: ' StealthForm__wordLine--highlight')
							}
						>
							<span id="stealthFormFrom" className="StealthForm__wordLabel">
								From
							</span>
							{isEditable ? (
								<input
									id="stealthFormFromInput"
									className="StealthForm__input"
									type="text"
									maxLength={4}
									value={fromVal}
									placeholder={from}
									aria-placeholder={from}
									aria-live="polite"
									aria-labelledby="stealthFormFrom"
									aria-invalid={error}
									onChange={handleFromChange}
									onKeyDown={handleKeyDown}
								/>
							) : from ? (
								from
							) : (
								'....'
							)}
						</span>
						<span className="StealForm__arrow">-></span>
						<span
							className={
								'StealthForm__wordLine' +
								(isEditable
									? ' StealthForm__wordLine--editable'
									: ' StealthForm__wordLine--highlight')
							}
						>
							<span id="stealthFormTo" className="StealthForm__wordLabel">
								To
							</span>
							{isEditable ? (
								<input
									id="stealthFormToInput"
									className="StealthForm__input"
									type="text"
									maxLength={4}
									value={toVal}
									placeholder={to}
									aria-placeholder={to}
									aria-live="polite"
									aria-labelledby="stealthFormTo"
									aria-invalid={error}
									onChange={handleToChange}
									onKeyDown={handleKeyDown}
								/>
							) : to ? (
								to
							) : (
								'....'
							)}
						</span>
					</h3>
					{isEditable && (
						<div className={getThemeClassname('StealthForm__error', dark)}>
							{error}
						</div>
					)}
					{isEditable && (
						<div className="StealthForm__btns">
							<button
								id="stealthFormRandomizeBtn"
								className="StealthForm__btn"
								aria-roledescription="Get a random pair of 4-letter words"
								onClick={handleRandomizeClick}
							>
								Randomize
							</button>
							<button
								id="stealthFormSubmitBtn"
								className="StealthForm__btn"
								onClick={handleSubmitClick}
							>
								Submit
							</button>
							<button
								id="stealthFormCancelBtn"
								className="StealthForm__btn"
								aria-label="Cancel Edit"
								onClick={handleCancelClick}
							>
								Cancel
							</button>
						</div>
					)}
				</div>
			</FocusTrap>
		</div>
	);
};

StealthForm.propTypes = {
	dark: PropTypes.bool,
	from: PropTypes.string,
	to: PropTypes.string,
	onChange: PropTypes.func,
};

export const mapStateToProps = ({ solo: { from, to }, theme: { dark } }) => ({
	from,
	to,
	dark,
});

export default connect(mapStateToProps)(StealthForm);

// Potential future improvements:
// --- ACCESSIBILITY ---
// - Putting form inside a fieldset tag with a legend
