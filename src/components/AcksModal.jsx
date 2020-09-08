import FocusTrap from 'focus-trap-react';
import PropTypes from 'prop-types';
import React from 'react';

import getThemeClassname from '../functions/getThemeClassname';

import './Home.less';

export const AcksModal = ({ dark, handleModalKeyDown, handleCloseAcks }) => (
	<FocusTrap>
		<div className="Home__modal" onKeyDown={handleModalKeyDown}>
			<div
				className={getThemeClassname('Home__modalContent', dark)}
				role="dialog"
				aria-modal={true}
				aria-labelledby="homeModalHeader"
			>
				<button
					id="homeCloseAcksBtn"
					className={getThemeClassname('Home__closeAcksBtn', dark)}
					aria-label="Close"
					onClick={handleCloseAcks}
				>
					X
				</button>
				<h2 id="homeModalHeader" className="Home__modalHeader">
					Acknowledgements
				</h2>
				<div id="homeModalDesc" className="Home__modalAck">
					Thank you to MCS, the one who introduced me to this word game.
				</div>
				<h3 className="Home__modalHeader">Icons</h3>
				<div className="Home__modalAck">
					Moon icon in theme toggle made by{' '}
					<a href="https://www.flaticon.com/authors/freepik" title="Freepik">
						Freepik
					</a>{' '}
					from{' '}
					<a href="https://www.flaticon.com/" title="Flaticon">
						{' '}
						www.flaticon.com
					</a>
				</div>
			</div>
		</div>
	</FocusTrap>
);

AcksModal.propTypes = {
	dark: PropTypes.bool,
	handleModalKeyDown: PropTypes.func,
	handleCloseAcks: PropTypes.func,
};

export default AcksModal;
