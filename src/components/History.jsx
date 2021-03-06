import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import getThemeClassname from '../functions/getThemeClassname';

import './History.less';

const makeMysteryStepListItems = num => {
	let all = [];
	for (let i = 0; i < num; i++) {
		all[i] = (
			<li
				className="History__hintMysteryLi History__listItem"
				key={`History__HintMystery--${i}`}
			>
				<div className="History__hintMystery">?</div>
			</li>
		);
	}
	return all;
};

export const History = ({
	dark,
	to,
	history,
	hintWord,
	hintNumLeft,
	win,
	showHint,
}) => {
	const historyBottomRef = useRef(null);

	useEffect(() => {
		historyBottomRef.current.scrollIntoView({
			behavior: 'smooth',
		});
	}, [history, historyBottomRef]);

	return (
		<div className="History" aria-labelledby="historyLabel">
			<h3 id="historyLabel" className="History__label">
				History
			</h3>
			<ul
				className={
					getThemeClassname('History__list', dark) +
					(win ? ' History__list--hideScroll' : '')
				}
				aria-live="polite"
			>
				{history.map((item, i) => (
					<li key={`historyItem-${i}`} className="History__listItem">
						{item}
					</li>
				))}
				<li ref={historyBottomRef} />

				{showHint &&
					(hintWord !== to ? (
						<>
							<li
								className={
									getThemeClassname('History__hintWord', dark) +
									' History__listItem'
								}
							>
								{hintWord}
							</li>
							{makeMysteryStepListItems(hintNumLeft - 2)}
							<li className="History__listItem">{to}</li>
						</>
					) : (
						<>
							<li className="History__listItem History__hintWord">
								{hintWord}
							</li>
						</>
					))}
			</ul>
		</div>
	);
};

History.propTypes = {
	dark: PropTypes.bool,
	to: PropTypes.string,
	history: PropTypes.arrayOf(PropTypes.string).isRequired,
	hintWord: PropTypes.string,
	hintNumLeft: PropTypes.number,
	win: PropTypes.bool,
	showHint: PropTypes.bool,
};

export const mapStateToProps = ({ theme: { dark } }) => ({
	dark,
});

export default connect(mapStateToProps)(History);
