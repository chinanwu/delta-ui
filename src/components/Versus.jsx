import React from 'react';
import { connect } from 'react-redux';

import getThemeClassname from '../functions/getThemeClassname';

import ThemeToggle from './ThemeToggle.jsx';

import './Versus.less';

export const Versus = ({ dark }) => {
	return (
		<div className={getThemeClassname('Versus', dark)}>
			<ThemeToggle />

			<h1 className="Versus__header">Versus</h1>

			<div className="Versus__form">
				<div className="Versus__field">
					<label htmlFor="gameCode" className="Versus__label">
						Code:{' '}
					</label>
					<input
						name="gameCode"
						className="Versus__input"
						placeholder="XXXX"
						maxLength={4}
					/>
				</div>

				<div className="Versus__field">
					<label htmlFor="playerName" className="Versus__label">
						Name:{' '}
					</label>
					<input
						name="playerName"
						className="Versus__input"
						placeholder="Salm"
						maxLength={4}
					/>
				</div>

				<button className="Versus__btn">Join</button>

				<button className="Versus__btn">Create</button>
			</div>
		</div>
	);
};

export const mapStateToProps = ({ theme: { dark } }) => ({
	dark,
});

export default connect(mapStateToProps)(Versus);

// TODO
// - Input verification - Only letters
// - Accessibility btns and inputs
