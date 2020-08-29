import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { getFetch } from '../functions/FetchFunctions';
import hasValidCharacters from '../functions/hasValidCharacters';

import './StealthInput.less';

export const StealthInput = ({ stealthModeOn, value, ariaLabel, onChange }) => {
	// TODO remoe me!
	const [val, setVal] = useState(value);

	const handleChange = useCallback(
		event => {
			if (event && event.target) {
				const newVal = event.target.value ? event.target.value.toString() : '';
				if (hasValidCharacters(newVal)) setVal(newVal);
			}
		},
		[setVal]
	);

	const handleClick = useCallback(() => {
		if (val.length < 4) {
			alert('Word must be 4 letters long!');
			return;
		}

		getFetch('/api/v1/words/validate?word=' + val).then(res => {
			if (res) {
				onChange(val);
			} else {
				alert('Word must be a real 4 letter English word!');
			}
		});
	}, [val, onChange]);

	return (
		<>
			{stealthModeOn ? (
				<>
					<div className="StealthInput__inputContainer">
						<input
							className="StealthInput"
							value={val}
							aria-label={ariaLabel}
							onChange={handleChange}
						/>
					</div>
					<button
						id="stealthInputConfirmBtn"
						className="StealthInput__submit"
						type="submit"
						aria-label="Submit"
						onClick={handleClick}
					>
						👍
					</button>
				</>
			) : (
				<>{value}</>
			)}
		</>
	);
};

StealthInput.propTypes = {
	stealthModeOn: PropTypes.bool,
	value: PropTypes.string,
	ariaLabel: PropTypes.string,
	onChange: PropTypes.func,
};

export default StealthInput;
