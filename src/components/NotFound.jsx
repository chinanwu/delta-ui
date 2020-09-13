import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import getThemeClassname from '../functions/getThemeClassname';

import withTitle from './HOC/withTitle.jsx';
import ThemeToggle from './ThemeToggle.jsx';

import './NotFound.less';

export const NotFound = ({ dark }) => (
	<div className={getThemeClassname('NotFound', dark)}>
		<ThemeToggle />
		<h1>404 - Page Not Found!</h1>
		<h2 className="NotFound__linkContainer">
			<span className="NotFound__linkWords">Perhaps you'd like a link</span>
			<Link className={getThemeClassname('NotFound__link', dark)} to="/">
				home
			</Link>
			?
		</h2>
	</div>
);

export const mapStateToProps = ({ theme: { dark } }) => ({
	dark,
});

export default withTitle('Not Found')(connect(mapStateToProps)(NotFound));
