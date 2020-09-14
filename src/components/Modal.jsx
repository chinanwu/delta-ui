import FocusTrap from 'focus-trap-react';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { escapeBtn } from '../constants/Keycodes';
import getThemeClassname from '../functions/getThemeClassname';

import './Modal.less';

export const Modal = ({
	dark,
	name,
	ariaLabelledBy,
	contentClassname,
	general,
	children,
	onClose,
}) => {
	const handleKeyDown = useCallback(
		event => {
			if (onClose) {
				if (event && event.keyCode) {
					if (event.keyCode === escapeBtn) {
						event.preventDefault();
						onClose();
					}
				}
			}
		},
		[onClose]
	);

	const handleClose = useCallback(() => {
		onClose();
	}, [onClose]);

	return (
		<FocusTrap>
			<div className="Modal" onKeyDown={handleKeyDown}>
				{general}
				<div
					className={
						getThemeClassname('Modal__content', dark) +
						(contentClassname ? ' ' + contentClassname : '')
					}
					role="dialog"
					aria-modal={true}
					aria-labelledby={ariaLabelledBy}
				>
					{onClose && (
						<button
							id="modalClose"
							className={getThemeClassname('Modal__close', dark)}
							aria-label={`Close ${name} modal`}
							onClick={handleClose}
						>
							X
						</button>
					)}

					{children}
				</div>
			</div>
		</FocusTrap>
	);
};

Modal.propTypes = {
	dark: PropTypes.bool,
	name: PropTypes.string,
	contentClassname: PropTypes.string,
	ariaLabelledBy: PropTypes.string,
	general: PropTypes.any,
	children: PropTypes.any,
	onClose: PropTypes.func,
};

export default Modal;
