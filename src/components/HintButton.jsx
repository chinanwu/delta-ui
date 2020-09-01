import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import './HintButton.less';

export const HintButton = ({
	id,
	children,
	btnText,
	numHints,
	ariaLabelledBy,
	onClick,
	onSolnClick,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleClick = useCallback(() => {
		if (numHints > 0) {
			setIsExpanded(isExpanded => {
				if (isExpanded) {
					return false;
				} else {
					onClick();
					return true;
				}
			});
		} else {
			setIsExpanded(isExpanded => {
				if (!isExpanded) {
					onSolnClick();
				} else {
					return false;
				}
			});
		}
	}, [isExpanded, setIsExpanded, onClick]);

	return (
		<div className="HintButton">
			<div
				className={
					'HintButton__content' +
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
	children: PropTypes.any,
	btnText: PropTypes.string,
	numHints: PropTypes.number,
	onClick: PropTypes.func,
	onSolnClick: PropTypes.func,
};

export default HintButton;
