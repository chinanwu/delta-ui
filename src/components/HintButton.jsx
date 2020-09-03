import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import getThemeClassname from '../functions/getThemeClassname';

import './HintButton.less';

export const HintButton = ({
	id,
	dark,
	children,
	btnText,
	numHints,
	isExpanded,
	ariaLabelledBy,
	onClick,
	onSolnClick,
	onExpandChange,
}) => {
	const handleClick = useCallback(() => {
		if (isExpanded) {
			onExpandChange(false);
		} else {
			if (numHints > 0) {
				onClick();
				onExpandChange(true);
			} else {
				onSolnClick();
			}
		}
	}, [isExpanded, numHints, onExpandChange, onClick, onSolnClick]);

	return (
		<div
			className={
				getThemeClassname('HintButton', dark) +
				(isExpanded ? ' HintButton--expanded' : '')
			}
		>
			<div
				className={
					getThemeClassname('HintButton__content', dark) +
					(isExpanded ? ' HintButton__content--expanded' : '')
				}
				aria-labelledby={ariaLabelledBy}
				aria-live="passive"
			>
				{children}
			</div>
			<button
				id={id}
				className={
					'HintButton__btn' + (isExpanded ? ' HintButton__btn--expanded' : '')
				}
				aria-label={
					isExpanded
						? 'Close Hint'
						: numHints === 0
						? 'Get the solution'
						: 'Get a Hint'
				}
				aria-expanded={isExpanded}
				aria-haspopup={!isExpanded && numHints === 0 ? 'dialog' : null}
				onClick={handleClick}
			>
				{isExpanded
					? 'Close Hint'
					: numHints === 0
					? 'Get the Solution'
					: btnText}
			</button>
		</div>
	);
};

HintButton.propTypes = {
	id: PropTypes.string.isRequired,
	dark: PropTypes.bool,
	children: PropTypes.any,
	btnText: PropTypes.string,
	numHints: PropTypes.number,
	onClick: PropTypes.func,
	onSolnClick: PropTypes.func,
	onExpandChange: PropTypes.func,
};

export default HintButton;
