import React from 'react';
import { Link } from 'react-router-dom';

import './NotFound.less';

export const NotFound = () => (
	<div className="NotFound">
		<h1>404, Page Not Found!</h1>
		<h2 className="NotFound__link">
			<span className="NotFound__linkWords">Perhaps you'd like a link</span>
			<Link to="/">home</Link>?
		</h2>
	</div>
);

export default NotFound;
