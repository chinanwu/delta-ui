import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { applyTheme } from '../thunk/ThemeThunk.jsx';

import './ThemeToggle.less';

export const ThemeToggle = ({ dark, onChangeTheme }) => {
	const handleChange = useCallback(() => {
		onChangeTheme(!dark);
	}, [dark, onChangeTheme]);

	return (
		<div className="ThemeToggle__container" aria-labelledby="themeToggleLabel">
			<label className="ThemeToggle">
				<input
					id="themeToggleInput"
					type="checkbox"
					checked={dark}
					aria-checked={dark}
					onChange={handleChange}
				/>
				<span className="ThemeToggle__slider" />
			</label>
			<div id="themeToggleLabel" className="ThemeToggle__label">
				Theme
			</div>
		</div>
	);
};

ThemeToggle.propTypes = {
	dark: PropTypes.bool,
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
