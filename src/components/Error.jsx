import React from 'react';

import './Error.less';
import { Link } from 'react-router-dom';

export const Error = () => {
	return (
		<div className="Error" role="alert" aria-busy="true">
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
};

export default Error;

// TODO:
// - Dark mode
