import React, { useCallback, useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';

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
	const [showAcks, setShowAcks] = useState(false);

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

	const handleCreateVersusClick = useCallback(() => {
		console.log('I want a versus game!');
	}, []);

	const handleOpenAcks = useCallback(() => {
		setShowAcks(true);
	}, [setShowAcks]);

	const handleCloseAcks = useCallback(() => {
		setShowAcks(false);
	}, [setShowAcks]);

	return redirect ? (
		<Redirect to={`/${gameUrl}`} />
	) : (
		<div className={getThemeClassname('Home', dark)}>
			<h1 className="Home__header">Delta</h1>
			<>
				<div>
					<Link to="/solo">
						<button
							id="homeCreateSoloBtn"
							className="Home__btn"
							aria-label="Create solo game"
							role="link"
						>
							Solo
						</button>
					</Link>

					<button
						id="homeCreateSoloBtn"
						className="Home__btn"
						aria-label="Create versus game"
						role="link"
						onClick={handleCreateVersusClick}
						disabled={true}
						aria-disabled={true}
					>
						Versus
					</button>
				</div>
				<div className="Home--centre" aria-labelledby="rules">
					<h2 id="rules">Rules</h2>
					<p className="Home__rules">
						In each game, you are given two words, a "from" word and a "to"
						word. Starting from the "from" word, one letter must changed at a
						time until the word becomes the "to" word. However, each time a
						letter is swapped out for another, the resulting new word must still
						be a valid four-letter word in the English language.
					</p>
				</div>
				<div className="Home--centre" aria-labelledby="example">
					<h2 id="example">Example</h2>
					<p>From: "heat" -> To: "cold"</p>
					<p className="Home__example--p">
						heat -> hea<strong className="Home__example--emphasis">d</strong> ->
						he<strong className="Home__example--emphasis">l</strong>d -> h
						<strong className="Home__example--emphasis">o</strong>ld ->{' '}
						<strong className="Home__example--emphasis">c</strong>old
					</p>
					<p className="Home__example--p">Or alternatively,</p>
					<p className="Home__example--p">
						heat -> <strong className="Home__example--emphasis">m</strong>eat ->
						m<strong className="Home__example--emphasis">o</strong>at -> moa
						<strong className="Home__example--emphasis">n</strong> -> mo
						<strong className="Home__example--emphasis">o</strong>n -> moo
						<strong className="Home__example--emphasis">d</strong> -> mo
						<strong className="Home__example--emphasis">l</strong>d ->{' '}
						<strong className="Home__example--emphasis">c</strong>old
					</p>
					<p className="Home__example--p">
						For most word pairs, there are a multitude of possible answers!
					</p>
				</div>
			</>
			<footer className={getThemeClassname('Home__footer', dark)}>
				<button
					id="homeOpenAcksBtn"
					className="Home__acksBtn"
					aria-label="Open Acknowledgements"
					onClick={handleOpenAcks}
				>
					Acknowledgements
				</button>
				<br />
				Made by <a href="https://chinanwu.com">Chin-An Wu</a>
			</footer>

			{showAcks &&
				createPortal(
					<FocusTrap>
						<div className="Home__modal">
							<div className="Home__modalContent">
								<button
									id="homeCloseAcksBtn"
									className="Home__closeAcksBtn"
									aria-label="Close"
									onClick={handleCloseAcks}
								>
									X
								</button>
								Thank you to MCS, the one who introduced me to this word game.
							</div>
						</div>
					</FocusTrap>,
					document.body
				)}
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

//					<div className="Home__gameCreate">
// 						<div className="Home__game">
// 							<input
// 								id="homeInput"
// 								className={`Home__input${error ? ' Home__input--error' : ''}`}
// 								type="text"
// 								name="gameUrl"
// 								value={gameUrl}
// 								onChange={handleChange}
// 							/>
// 							<div className="Home__btnContainer">
// 								<button
// 									id="homeCreateBtn"
// 									type="submit"
// 									className={`Home__btn${error ? ' Home__btn--error' : ''}`}
// 									disabled={!!error}
// 									onClick={handleCreateClick}
// 								>
// 									Create
// 								</button>
// 							</div>
// 						</div>
// 						<p className="Home__error" aria-hidden={!error}>
// 							{error}
// 						</p>
// 					</div>
