import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import getThemeClassname from '../functions/getThemeClassname';

import { applyTheme } from '../thunk/ThemeThunk.jsx';

import './ThemeToggle.less';

export const ThemeToggle = ({ dark, isHome, onChangeTheme }) => {
	const handleChange = useCallback(() => {
		onChangeTheme(!dark);
	}, [dark, onChangeTheme]);

	return (
		<div
			className={
				'ThemeToggle__container' +
				(isHome ? ' ThemeToggle__container--banner' : '')
			}
		>
			<label className="ThemeToggle">
				<input
					id="themeToggleInput"
					type="checkbox"
					checked={dark}
					aria-checked={dark}
					aria-labelledby="themeToggleLabel"
					onChange={handleChange}
				/>
				<span className={getThemeClassname('ThemeToggle__slider', dark)} />
			</label>
			<div id="themeToggleLabel" className="ThemeToggle__label">
				Theme
			</div>
		</div>
	);
};

ThemeToggle.propTypes = {
	dark: PropTypes.bool,
	isHome: PropTypes.bool,
	onChangeTheme: PropTypes.func,
};

export const mapStateToProps = ({ theme: { dark } }) => ({
	dark,
});

const mapDispatchToProps = {
	onChangeTheme: applyTheme,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ThemeToggle);
