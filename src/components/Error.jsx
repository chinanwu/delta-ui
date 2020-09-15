import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import getThemeClassname from '../functions/getThemeClassname';

import './Error.less';

export const Error = ({ dark }) => (
	<div
		className={getThemeClassname('Error', dark)}
		role="alert"
		aria-busy="true"
	>
		<div className="Error__content">
			<span>Something wrong happened! Please try again.</span>
			<Link to="/">
				<button id="errorHomeBtn" className="Error__homeBtn" role="link">
					Return Home
				</button>
			</Link>
		</div>
	</div>
);

Error.propTypes = {
	dark: PropTypes.bool,
};

export default Error;

// TODO:
// - Accessibility

// Potential future improvements:
// - Make this into a toast?
