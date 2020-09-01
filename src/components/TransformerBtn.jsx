import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import './TransformerBtn.less';

const ariaLabelObj = {
	'aria-label': 'Get a Hint',
};

const ariaLabelledByObj = {
	'aria-labelledby': 'transformerBtnHeader',
};

export const TransformerBtn = ({ id, children, btnText, onClick }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [ariaLabelDyn, setAriaLabelDyn] = useState(ariaLabelObj);

	const handleClick = useCallback(() => {
		setIsExpanded(isExpanded => {
			if (isExpanded) {
				return false;
			} else {
				onClick();
				return true;
			}
		});
		setAriaLabelDyn(current => {
			if (current === ariaLabelObj) {
				return ariaLabelledByObj;
			}

			return ariaLabelObj;
		});
	}, [isExpanded, ariaLabelDyn, setIsExpanded, setAriaLabelDyn, onClick]);

	return (
		<div className="TransformerBtnContainer">
			<div
				id={id}
				className={
					'TransformerBtn' + (isExpanded ? ' TransformerBtn--expanded' : '')
				}
				role={isExpanded ? null : 'button'} // Really unsure about this
				{...ariaLabelDyn}
				aria-expanded={isExpanded}
				aria-live="passive"
				onClick={handleClick}
			>
				{isExpanded ? <>{children}</> : <>{btnText}</>}
			</div>
		</div>
	);
};

TransformerBtn.propTypes = {
	id: PropTypes.string.isRequired,
	children: PropTypes.any,
	btnText: PropTypes.string,
	onClick: PropTypes.func,
};

export default TransformerBtn;
