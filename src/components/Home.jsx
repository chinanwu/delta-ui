import FocusTrap from 'focus-trap-react';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { escapeBtn } from '../constants/Keycodes';
import { getFetch } from '../functions/FetchFunctions';
import getThemeClassname from '../functions/getThemeClassname';
import { applyFrom, applyTo } from '../thunk/GameThunk.jsx';

import Loading from './Loading.jsx';
import ThemeToggle from './ThemeToggle.jsx';

import './Home.less';

export const Home = ({ dark }) => {
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [showAcks, setShowAcks] = useState(false);
	const [loading, setLoading] = useState(false);
	const [leaderboard, setLeaderboard] = useState([]);

	useEffect(() => {
		document.title = 'Home - Delta';
	}, []);

	useEffect(() => {
		setLoading(true);
		getFetch('/api/v1/dailychallenge')
			.then(res => {
				if (res.leaderboard) {
					const resLeaderboard = [];
					for (let i = 0; i < res.leaderboard.length; i++) {
						resLeaderboard[i] = [
							res.leaderboard[i].name,
							res.leaderboard[i].score,
						];
					}
					setLeaderboard(resLeaderboard);
				}
			})
			.then(() => setLoading(false));
	}, [setLoading, setLeaderboard]);

	const handleLeaderboardClick = useCallback(() => {
		setShowLeaderboard(showLeaderboard => !showLeaderboard);
	}, [showLeaderboard, setShowLeaderboard]);

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

	return (
		<div className={getThemeClassname('Home', dark)}>
			<ThemeToggle />

			<h1 className="Home__header">Delta</h1>
			<>
				<div className="Home__btns">
					<Link className="Home__btnContainer" to="/solo">
						<button
							id="homeCreateSoloBtn"
							className="Home__btn Home__soloBtn"
							aria-label="Create solo game"
							role="link"
						>
							Play!
						</button>
					</Link>
					<Link className="Home__btnContainer" to="/daily">
						<button
							id="homeDailyBtn"
							className="Home__btn Home__dailyBtn"
							role="link"
						>
							Daily Challenge
						</button>
					</Link>
				</div>

				<div
					className={getThemeClassname('Home--centre', dark)}
					aria-label="Daily Challenge"
				>
					<p className="Home__dailyExplanation">
						Complete the daily challenge with a record (read: top 10) score and
						be added to the daily leaderboard! New challenges every day at
						midnight EST (UTC -5).
					</p>
					<div className="Home__leaderboard">
						<button
							id="homeLeaderboardBtn"
							className="Home__leaderboardBtn"
							onClick={handleLeaderboardClick}
						>
							<span>Today's Leaderboard</span>{' '}
							<span>{showLeaderboard ? '-' : '+'}</span>
						</button>
						<div
							className={
								getThemeClassname('Home__leaderboardContent', dark) +
								(showLeaderboard ? ' Home__leaderboardContent--expanded' : '')
							}
						>
							{leaderboard ? (
								leaderboard.length > 0 ? (
									<table>
										<thead>
											<tr>
												<th>Rank</th>
												<th>Name</th>
												<th>Score</th>
											</tr>
										</thead>
										<tbody>
											{leaderboard.map((player, i) => (
												<tr key={`key--${i}`}>
													<td>{i + 1}</td>
													<td>{player[0]}</td>
													<td>{player[1]}</td>
												</tr>
											))}
										</tbody>
									</table>
								) : (
									<p>No one has completed the Daily Challenge... yet? 👀</p>
								)
							) : null}
						</div>
					</div>
				</div>
				<div
					className={getThemeClassname('Home--centre', dark)}
					aria-labelledby="rules"
				>
					<h2 id="rules">Rules</h2>
					<p className="Home__rules">
						In each game, you are given two words, a "from" word and a "to"
						word. Starting from the "from" word, one letter must changed at a
						time until the word becomes the "to" word. However, each time a
						letter is swapped out for another, the resulting new word must still
						be a valid four-letter word in the English language.
					</p>
				</div>
				<div
					className={getThemeClassname('Home--centre', dark)}
					aria-labelledby="example"
				>
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
			<footer
				className={
					getThemeClassname('Home__footer', dark) +
					(showLeaderboard ? ' Home__footer--relative' : '')
				}
			>
				<button
					id="homeOpenAcksBtn"
					className={getThemeClassname('Home__acksBtn', dark)}
					aria-haspopup="dialog"
					onClick={handleOpenAcks}
				>
					Acknowledgements
				</button>
				<br />
				Made by <a href="https://chinanwu.com">Chin-An Wu</a>
			</footer>

			{loading && createPortal(<Loading />, document.body)}

			{showAcks &&
				createPortal(
					<FocusTrap>
						<div
							id="homeModalDiv"
							className="Home__modal"
							onKeyDown={handleModalKeyDown}
						>
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
// - Esc keydown for modal
