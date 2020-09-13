import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import getThemeClassname from '../functions/getThemeClassname';

import './HintButton.less';

// Notes:
// dark can be grabbed by HintButton
// id, hint, numHints, isExpanded, giveSolution, onSolnClick, onHint, onClick provided

export const HintButton = ({
	id,
	dark,
	hint,
	numHints,
	isExpanded,
	error,
	giveSolution,
	onSolnClick,
	onHint,
	onClose,
}) => {
	// noinspection CommaExpressionJS
	const handleClick = useCallback(
		() =>
			isExpanded
				? onClose()
				: numHints > 0
				? onHint()
				: giveSolution
				? onSolnClick()
				: null,
		[isExpanded, numHints, giveSolution, onHint, onSolnClick]
	);

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
				aria-labelledby="hintHeader"
				aria-live="passive"
			>
				<h3 id="hintHeader">Hint: </h3>
				<p className="HintButton__hint">
					Recommended next word: {hint ? hint.word : ''}
				</p>
				<p className="HintButton__hint">
					Estimated number of words left: {hint ? hint.numLeft : ''}
				</p>
			</div>
			<button
				id={id}
				className={
					'HintButton__btn' +
					(isExpanded
						? ' HintButton__btn--expanded'
						: !giveSolution && numHints === 0 && dark
						? ' HintButton__btn--disabled--dark'
						: '')
				}
				aria-label={
					isExpanded
						? 'Close Hint'
						: numHints === 0
						? giveSolution
							? 'Get the solution'
							: 'Out of Hints'
						: 'Get a Hint'
				}
				aria-expanded={isExpanded}
				aria-haspopup={!isExpanded && numHints === 0 ? 'dialog' : null}
				disabled={!giveSolution && numHints === 0 && !isExpanded}
				onClick={handleClick}
			>
				{isExpanded
					? 'Close Hint'
					: numHints === 0
					? giveSolution
						? 'Get the solution'
						: 'Out of Hints'
					: `Get a Hint: ${numHints}`}
			</button>
		</div>
	);
};

export const mapStateToProps = ({ theme: { dark } }) => ({
	dark,
});

HintButton.propTypes = {
	id: PropTypes.string,
	dark: PropTypes.bool,
	hint: PropTypes.object,
	numHints: PropTypes.number,
	isExpanded: PropTypes.bool,
	error: PropTypes.string,
	giveSolution: PropTypes.bool,
	onHint: PropTypes.func,
	onSolnClick: PropTypes.func,
	onClose: PropTypes.func,
};

export default HintButton;
