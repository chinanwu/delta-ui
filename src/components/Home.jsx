import React, { useCallback, useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';

import { escapeBtn } from '../constants/Keycodes';
import { getFetch } from '../functions/FetchFunctions';
import getThemeClassname from '../functions/getThemeClassname';
import { applyFrom, applyTo } from '../thunk/GameThunk.jsx';

import ThemeToggle from './ThemeToggle.jsx';

import './Home.less';

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
				<div className="Home--centre" aria-labelledby="funFacts">
					<h2 id="funFacts">Fun Facts!</h2>
					<p>
						There are <strong>3997</strong> 4 letter words*! Of those, 62 have{' '}
						<strong>no</strong> words that are one letter off from them! Meaning
						they are essentially <strong>impossible</strong> problems. They are
						not able to be provided as a game word though, no worries! <br />* =
						Think this is wrong? Want to add a word? Create an issue or make a
						pull request on the Delta-API{' '}
						<a
							href="https://github.com/chinanwu/delta-api/issues"
							title="A link to the issues section of Delta-API"
						>
							github
						</a>
					</p>
					<p>
						The longest path needed to get (optimally) between two words is{' '}
						<strong>17</strong>. There are currently <strong>four</strong>{' '}
						unique pairings (atap -> unau, atom -> unau, inch -> unau, quey ->
						unau) that requires 17 steps to get from one of the words to the
						other. All four have one thing in common - They all have{' '}
						<strong>unau</strong>, in the problem pairing, which is a South
						American sloth! Neat!
					</p>
					<p>
						The average (optimal) path to get from one word to another is{' '}
						<strong>four</strong>.
					</p>
				</div>
			</>
			<footer className={getThemeClassname('Home__footer', dark)}>
				<button
					id="homeOpenAcksBtn"
					className={getThemeClassname('Home__acksBtn', dark)}
					aria-label="Open Acknowledgements"
					aria-haspopup="dialog"
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
						<div className="Home__modal" onKeyDown={handleModalKeyDown}>
							<div
								className={getThemeClassname('Home__modalContent', dark)}
								role="dialog"
								aria-modal={true}
								aria-labelledby="homeModalHeader"
							>
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
								<div id="homeModalDesc" className="Home__modalAck">
									Thank you to MCS, the one who introduced me to this word game.
								</div>
								<h3 className="Home__modalHeader">Icons</h3>
								<div className="Home__modalAck">
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

// TODO:
// - Double check accessibility for this page.
//       - Missing any aria?
// - Figuring out if I really want Fun Facts, and how I want to do it.
// 			 - If I remove it, reminder to reset the Home__footer position to a different height
// - Figure out a better way to prevent scrolling on body when Modal opens (if there is a way)
// - Add styling specific to each platform (e.g. moz, etc.)
