import React, { useCallback, useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import { escapeBtn } from '../constants/Keycodes';

import generateGameUrl from '../functions/generateGameUrl';
import getThemeClassname from '../functions/getThemeClassname';
import hasValidCharacters from '../functions/hasValidCharacters';
import { applyFrom, applyTo } from '../thunk/GameThunk.jsx';

import ThemeToggle from './ThemeToggle.jsx';

import './Home.less';

// Modal boxshadow

export const Home = ({ dark }) => {
	const [redirect, setRedirect] = useState(false);
	const [showAcks, setShowAcks] = useState(false);

	useEffect(() => {
		document.title = 'Home - Delta';
	}, []);

	const handleCreateVersusClick = useCallback(() => {
		console.log('I want a versus game!');
	}, []);

	const handleOpenAcks = useCallback(() => {
		// TODO: figure out a better way to do this
		document.body.classList.add('Modal--open');
		setShowAcks(true);
	}, [setShowAcks]);

	const handleCloseAcks = useCallback(() => {
		document.body.classList.remove('Modal--open');
		setShowAcks(false);
	}, [setShowAcks]);

	const handleModalKeyDown = useCallback(
		event => {
			if (event && event.keyCode) {
				if (event.keyCode === escapeBtn) {
					event.preventDefault();
					handleCloseAcks();
				}
			}
		},
		[setShowAcks]
	);

	return redirect ? (
		<Redirect to={`/${gameUrl}`} />
	) : (
		<div className={getThemeClassname('Home', dark)}>
			<ThemeToggle />

			<h1 className="Home__header">Delta</h1>
			<>
				<h2 className="Home--centre Home__gameModeLabel">Game Mode:</h2>
				<div className="Home__btns">
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
						heat -> hea
						<strong
							className={getThemeClassname('Home__example--emphasis', dark)}
						>
							d
						</strong>{' '}
						-> he
						<strong
							className={getThemeClassname('Home__example--emphasis', dark)}
						>
							l
						</strong>
						d -> h
						<strong
							className={getThemeClassname('Home__example--emphasis', dark)}
						>
							o
						</strong>
						ld ->{' '}
						<strong
							className={getThemeClassname('Home__example--emphasis', dark)}
						>
							c
						</strong>
						old
					</p>
					<p className="Home__example--p">Or alternatively,</p>
					<p className="Home__example--p">
						heat ->{' '}
						<strong
							className={getThemeClassname('Home__example--emphasis', dark)}
						>
							m
						</strong>
						eat -> m
						<strong
							className={getThemeClassname('Home__example--emphasis', dark)}
						>
							o
						</strong>
						at -> moa
						<strong
							className={getThemeClassname('Home__example--emphasis', dark)}
						>
							n
						</strong>{' '}
						-> mo
						<strong
							className={getThemeClassname('Home__example--emphasis', dark)}
						>
							o
						</strong>
						n -> moo
						<strong
							className={getThemeClassname('Home__example--emphasis', dark)}
						>
							d
						</strong>{' '}
						-> mo
						<strong
							className={getThemeClassname('Home__example--emphasis', dark)}
						>
							l
						</strong>
						d ->{' '}
						<strong
							className={getThemeClassname('Home__example--emphasis', dark)}
						>
							c
						</strong>
						old
					</p>
					<p className="Home__example--p">
						For most word pairs, there are a multitude of possible answers!
					</p>
				</div>
			</>
			<footer className={getThemeClassname('Home__footer', dark)}>
				<button
					id="homeOpenAcksBtn"
					className={getThemeClassname('Home__acksBtn', dark)}
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
						<div
							className="Home__modal"
							role="dialog"
							aria-labelledby="homeModalHeader"
							aria-describedby="homeModalDesc"
							aria-modal={true}
							onKeyDown={handleModalKeyDown}
						>
							<div className={getThemeClassname('Home__modalContent', dark)}>
								<button
									id="homeCloseAcksBtn"
									className={getThemeClassname('Home__closeAcksBtn', dark)}
									aria-label="Close"
									onClick={handleCloseAcks}
								>
									X
								</button>
								<h2 id="homeModalHeader" className="Home__modalHeader">
									Acknowledgements
								</h2>
								<div id="homeModalDesc" className="Home__modalDesc">
									Thank you to MCS, the one who introduced me to this word game.
								</div>
								<h3 className="Home__modalHeader">Icons</h3>
								<div className="Home__modalDesc">
									Moon icon in theme toggle made by{' '}
									<a
										href="https://www.flaticon.com/authors/freepik"
										title="Freepik"
									>
										Freepik
									</a>{' '}
									from{' '}
									<a href="https://www.flaticon.com/" title="Flaticon">
										{' '}
										www.flaticon.com
									</a>
								</div>
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
