import React, { useCallback, useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { postFetch } from '../functions/FetchFunctions';
import generateGameUrl from '../functions/generateGameUrl';
import getThemeClassname from '../functions/getThemeClassname';
import hasValidCharacters from '../functions/hasValidCharacters';
import { applyFrom, applyTo } from '../thunk/GameThunk.jsx';

import './Home.less';

export const Home = ({ dark, onChangeFrom, onChangeTo }) => {
	const [gameUrl, setGameUrl] = useState(generateGameUrl);
	const [error, setError] = useState(null);
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		document.title = 'Home - Delta';
	}, []);

	const handleChange = useCallback(
		event => {
			if (event && event.target) {
				if (event.target.value) {
					const url = event.target.value;
					setGameUrl(url);
					hasValidCharacters(url)
						? setError(null)
						: setError('Game URL must only contain letters');
				} else {
					setGameUrl('');
					setError('Game URL cannot be empty');
				}
			}
		},
		[setGameUrl, setError]
	);

	const handleCreateClick = useCallback(() => {
		if (!error) {
			postFetch(
				'http://localhost:5000/api/v1/games/new',
				JSON.stringify({ url: gameUrl })
			).then(res => {
				res.success
					? setRedirect(true)
					: setError(
							`Unable to create new game with url: ${gameUrl}. Please try again`
					  );
			});
		}
	}, [error, gameUrl, setRedirect, setError]);

	return redirect ? (
		<Redirect to={`/${gameUrl}`} />
	) : (
		<div className={getThemeClassname('Home', dark)}>
			<h1 className="Home__header">Delta</h1>
			<>
				<div className="Home__gameCreate">
					<div className="Home__game">
						<input
							id="homeInput"
							className={`Home__input${error ? ' Home__input--error' : ''}`}
							type="text"
							name="gameUrl"
							value={gameUrl}
							onChange={handleChange}
						/>
						<div className="Home__btnContainer">
							<button
								id="homeCreateBtn"
								type="submit"
								className={`Home__btn${error ? ' Home__btn--error' : ''}`}
								disabled={!!error}
								onClick={handleCreateClick}
							>
								Create
							</button>
						</div>
					</div>
					<p className="Home__error" aria-hidden={!error}>
						{error}
					</p>
				</div>
				<h2>Rules</h2>
				<p className="Home__rules">
					In each game, you are given two words, a "from" word and a "to" word.
					Starting from the "from" word, one letter must changed at a time until
					the word becomes the "to" word. However, each time a letter is swapped
					out for another, the resulting new word must still be a valid
					four-letter word in the English language.
				</p>
				<h2>Example</h2>
				<p>From: "heat" -> To: "cold"</p>
				<p className="Home__example--p">
					heat -> hea<strong className="Home__example--emphasis">d</strong> ->
					he<strong className="Home__example--emphasis">l</strong>d -> h
					<strong className="Home__example--emphasis">o</strong>ld ->{' '}
					<strong className="Home__example--emphasis">c</strong>old
				</p>
				<p className="Home__example--p">Or alternatively,</p>
				<p className="Home__example--p">
					heat -> <strong className="Home__example--emphasis">m</strong>eat -> m
					<strong className="Home__example--emphasis">o</strong>at -> moa
					<strong className="Home__example--emphasis">n</strong> -> mo
					<strong className="Home__example--emphasis">o</strong>n -> moo
					<strong className="Home__example--emphasis">d</strong> -> mo
					<strong className="Home__example--emphasis">l</strong>d ->{' '}
					<strong className="Home__example--emphasis">c</strong>old
				</p>
				<p className="Home__example--p">
					For most word pairs, there are a multitude of possible answers!
				</p>
			</>
			<div
				className={getThemeClassname('Home__footer', dark)}
				aria-label="Footer"
			>
				Made by <a href="https://www.github.com/chinanwu">Chin-An Wu</a>
			</div>
		</div>
	);
};

Home.propTypes = {
	dark: PropTypes.bool,
};

export const mapStateToProps = ({ theme: { dark } }) => ({
	dark,
});

const mapDispatchToProps = {
	onChangeFrom: applyFrom,
	onChangeTo: applyTo,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home);
