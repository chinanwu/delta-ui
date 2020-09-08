import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { getFetch } from '../functions/FetchFunctions';

import Loading from './Loading.jsx';

import './Home.less';

export const Leaderboard = () => {
	const [leaderboard, setLeaderboard] = useState([]);
	const [loading, setLoading] = useState([]);

	useEffect(() => {
		setLoading(true);
		getFetch('/api/v1/dailychallenge')
			.then(res => {
				if (res.leaderboard) {
					const leaderboard = [];
					for (let i = 0; i < res.leaderboard.length; i++) {
						leaderboard[i] = [
							res.leaderboard[i].name,
							res.leaderboard[i].score,
						];
					}
					setLeaderboard(leaderboard);
				}
			})
			.then(() => setLoading(false));
	}, [setLoading, setLeaderboard]);

	return (
		<>
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
			{loading && createPortal(<Loading />, document.body)}
		</>
	);
};

export default Leaderboard;
