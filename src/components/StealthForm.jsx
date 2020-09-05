import FocusTrap from 'focus-trap-react';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

import { enterBtn, escapeBtn, spaceBtn } from '../constants/Keycodes';
import { getFetch } from '../functions/FetchFunctions';
import getThemeClassname from '../functions/getThemeClassname';
import hasValidCharacters from '../functions/hasValidCharacters';

import Loading from './Loading.jsx';

import './StealthForm.less';

export const StealthForm = ({ from, to, dark, onChange }) => {
	const [loading, setLoading] = useState(false);
	const [isEditable, setIsEditable] = useState(false);
	const [fromVal, setFromVal] = useState('');
	const [toVal, setToVal] = useState('');
	const [error, setError] = useState('');

	const handleOpen = useCallback(() => {
		setIsEditable(true);
	}, [setIsEditable]);

	const handleCancelClick = useCallback(() => {
		setIsEditable(false);
		setFromVal('');
		setToVal('');
		setError('');
	}, [setIsEditable, setFromVal, setToVal, setError]);

	const handleFromChange = useCallback(
		event => {
			if (event && event.target) {
				const val = event.target.value ? event.target.value.toString() : '';
				if (hasValidCharacters(val)) setFromVal(val);
			}
		},
		[setFromVal]
	);

	const handleToChange = useCallback(
		event => {
			if (event && event.target) {
				const val = event.target.value ? event.target.value.toString() : '';
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
		[
			fromVal,
			toVal,
			setLoading,
			setError,
			onChange,
			setIsEditable,
			setFromVal,
			setToVal,
			setError,
		]
	);

	const handleRandomizeClick = useCallback(() => {
		setLoading(true);
		getFetch('/api/v1/words')
			.then(res => {
				if (res.from && res.to) {
					setFromVal(res.from);
					setToVal(res.to);
				} else {
					setError('Something went wrong Randomizing!');
				}
			})
			.then(() => setLoading(false));
	}, [setLoading, setFromVal, setToVal, setError]);

	const handleSubmitClick = useCallback(() => {
		setLoading(true);
		getFetch(`/api/v1/validate?word=${fromVal}&word=${toVal}`)
			.then(res => {
				if (res.success) {
					onChange(fromVal, toVal);
					setIsEditable(false);
				} else {
					setError('Invalid word(s) provided');
				}
			})
			.then(() => setLoading(false));
	}, [fromVal, toVal, setLoading, setError, onChange]);

	return (
		<div className="StealthForm">
			<button
				id="stealthFormEditBtn"
				className="StealthForm__btn StealthForm__editBtn"
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
					<h3 className="StealthForm__words">
						<span id="stealthFormFrom">From</span>:{' '}
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
						) : (
							from
						)}
						<span className="StealForm__arrow">-></span>
						<span id="stealthFormTo">To</span>:{' '}
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
						) : (
							to
						)}
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

			{loading && createPortal(<Loading />, document.body)}
		</div>
	);
};

StealthForm.propTypes = {
	from: PropTypes.string,
	to: PropTypes.string,
	dark: PropTypes.bool,
	onChange: PropTypes.func,
	onRandomizeClick: PropTypes.func,
};
export default StealthForm;

//handleKeyDown enter to submit
