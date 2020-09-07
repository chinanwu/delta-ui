import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { getFetch } from '../functions/FetchFunctions';
import getThemeClassname from '../functions/getThemeClassname';
import hasValidCharacters from '../functions/hasValidCharacters';

import Loading from './Loading.jsx';
import ThemeToggle from './ThemeToggle.jsx';

import './Versus.less';

export const Versus = ({ dark }) => {
	const [loading, setLoading] = useState(false);
	const [redirect, setRedirect] = useState('');
	const [error, setError] = useState('');
	const [code, setCode] = useState('');
	const [name, setName] = useState('');

	useEffect(() => {
		document.title = 'Versus - Delta';
	}, []);

	const handleCodeChange = useCallback(
		event => {
			if (event && event.target) {
				const val = event.target.value ? event.target.value.toString() : '';
				if (hasValidCharacters(val)) setCode(val);
			}
		},
		[setCode]
	);

	const handleNameChange = useCallback(
		event => {
			if (event && event.target) {
				const val = event.target.value ? event.target.value.toString() : '';
				if (hasValidCharacters(val)) setName(val);
			}
		},
		[setName]
	);

	const handleJoin = useCallback(() => {
		if (code.length < 4) {
			setError('Game code needs to be 4 characters long!');
		} else if (name.length === 0) {
			// Short name OK? TODO
			setError('Please enter a name');
		} else {
			setError(null);
			setLoading(true);
			getFetch(`/api/v1/game?code=${code}`)
				.then(res => {
					// TODO double check response
					if (res.Game.id) {
						if (res.Game.players.length > 4) {
							setError('Game full!');
						} else {
							setRedirect(res.Game.id);
						}
					} else {
						// Might need to .catch() it? TODO
						setError('No game exists at: ' + code + '. Please create a game.');
					}
				})
				.then(() => setLoading(false));
		}
	}, [code, name, setError, setLoading, setRedirect]);

	const handleCreate = useCallback(() => {
		if (code.length < 4) {
			setError('Game code needs to be 4 characters long!');
		} else if (name.length === 0) {
			// Short name OK? TODO
			setError('Please enter a name');
		} else {
			setError(null);
			setLoading(true);
			getFetch(`/api/v1/game?code=${code}`)
				.then(res => {
					// TODO double check response
					if (res.Game.id) {
						setError('Game already exists! Please join.');
					} else {
						const newGame = {
							code: code,
							playerId: '',
							playerName: name,
						};

						// postFetch('/api/v1/game');
					}
				})
				.then(() => setLoading(false));
		}
	}, []);

	return redirect ? (
		<Redirect to={`/${redirect}`} />
	) : (
		<div className={getThemeClassname('Versus', dark)}>
			<ThemeToggle />

			<h1 className="Versus__header">Versus</h1>
			<div className="Versus__headerSubtext">Up to 4 players!</div>

			<div className="Versus__form">
				<div className="Versus__field">
					<label htmlFor="gameCode" className="Versus__label">
						Code:{' '}
					</label>
					<input
						name="gameCode"
						className={getThemeClassname('Versus__input', dark)}
						placeholder="XXXX"
						maxLength={4}
						value={code}
						required={true}
						aria-required={true}
						onChange={handleCodeChange}
					/>
				</div>
				<div className="Versus__field">
					<label htmlFor="playerName" className="Versus__label">
						Name:{' '}
					</label>
					<input
						name="playerName"
						className={getThemeClassname('Versus__input', dark)}
						placeholder="Sock"
						maxLength={4}
						value={name}
						required={true}
						aria-required={true}
						onChange={handleNameChange}
					/>
				</div>

				{error && (
					<div className={getThemeClassname('Versus__error', dark)}>
						{error}
					</div>
				)}
				<button id="versusJoin" className="Versus__btn" onClick={handleJoin}>
					Join A Room
				</button>

				<div className="Versus__or">--- OR ---</div>

				<button id="versusCreate" className="Versus__btn">
					Create A Room
				</button>

				<div className="Versus__gameOpts">
					<div className="Versus__gameOptsHeader">Room Creation Options</div>
					<fieldset className="Versus__gameOptsInputContainer">
						<legend className="Versus__winCondtHeader">Win condition:</legend>
						<div>
							<input
								type="radio"
								name="versusCondtn"
								id="versusSpeedCondtn"
								defaultChecked
							/>
							<label
								htmlFor="versusSpeedCondtn"
								className="Versus__winCondtRadioLabel"
							>
								Speed
							</label>
						</div>
						<div>
							<input type="radio" name="versusCondtn" id="versusScoreCondtn" />
							<label
								htmlFor="versusScoreCondtn"
								className="Versus__winCondtRadioLabel"
							>
								Score
							</label>
						</div>
					</fieldset>
				</div>
			</div>

			{loading && createPortal(<Loading />, document.body)}
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
// - input id or name for label?
// - Fieldset and legend?
