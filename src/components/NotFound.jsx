import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import getThemeClassname from '../functions/getThemeClassname';

import ThemeToggle from './ThemeToggle.jsx';

import './NotFound.less';

export const NotFound = ({ dark }) => (
	<div className={getThemeClassname('NotFound', dark)}>
		<ThemeToggle />
		<h1>404, Page Not Found!</h1>
		<h2 className="NotFound__link">
			<span className="NotFound__linkWords">Perhaps you'd like a link</span>
			<Link to="/">home</Link>?
		</h2>
	</div>
);

export const mapStateToProps = ({ theme: { dark } }) => ({
	dark,
});

export default connect(mapStateToProps)(NotFound);
