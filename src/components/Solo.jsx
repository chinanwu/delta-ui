import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getFetch } from '../functions/FetchFunctions';
import getThemeClassname from '../functions/getThemeClassname';
import hasValidCharacters from '../functions/hasValidCharacters';
import { applyFrom, applyTo, applyGame } from '../thunk/GameThunk.jsx';

import Loading from './Loading.jsx';

import './Solo.less';

export const Solo = ({
	dark,
	from,
	to,
	onChangeFrom,
	onChangeTo,
	onChangeGame,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	// This allows for a bit of a hack way to do this fadeOut animation for the editor.
	// Need to study how others do Accordians or menu animations to see how to not do this
	// Or do a smarter hack lol
	const [showEditor, setShowEditor] = useState('');
	const [editorFromVal, setEditorFromVal] = useState(from);
	const [editorToVal, setEditorToVal] = useState(to);

	useEffect(() => {
		document.title = 'Solo - Delta';
	}, []);

	useEffect(() => {
		if (!from && !to) {
			setLoading(true);
			getFetch('http://localhost:5000/api/v1/games/words').then(res => {
				if (res.success && res.data && res.data.from && res.data.to) {
					onChangeGame({ from: res.data.from, to: res.data.to });
					setLoading(false);
				} else {
					setError('Something went wrong grabbing game words!');
				}
			});
		}
	}, [from, to, onChangeFrom, onChangeTo, setLoading, setError]);

	// Duplicate code here, but not sure what is the best way to pull it out, because of the state vals
	const handleNewClick = useCallback(() => {
		setLoading(true);
		getFetch('http://localhost:5000/api/v1/games/words').then(res => {
			if (res.success && res.data && res.data.from && res.data.to) {
				onChangeGame({ from: res.data.from, to: res.data.to });
				setLoading(false);
			} else {
				setError('Something went wrong grabbing game words!');
			}
		});
	}, [onChangeFrom, onChangeTo, setLoading, setError]);

	const handleEditClick = useCallback(() => {
		setShowEditor('show');
	}, [setShowEditor]);

	const handleChangeFromEditor = useCallback(
		event => {
			if (event && event.target) {
				const val = event.target.value ? event.target.value.toString() : '';
				if (hasValidCharacters(val)) setEditorFromVal(val);
			}
		},
		[setEditorFromVal]
	);

	const handleChangeToEditor = useCallback(
		event => {
			if (event && event.target) {
				const val = event.target.value ? event.target.value.toString() : '';
				if (hasValidCharacters(val)) setEditorToVal(val);
			}
		},
		[setEditorToVal]
	);

	const handleSubmitEditor = useCallback(() => {
		if (editorFromVal.length < 4 || editorToVal.length < 4) {
			// Maybe I'll customize an alert in the future, TODO
			alert('Words must be 4 letters long!');
			return;
		}

		setLoading(true);
		getFetch(
			`/api/v1/words/validateMany?words=${editorFromVal}&words=${editorToVal}`
		).then(res => {
			if (res) {
				setShowEditor('hidden');
				onChangeGame({ from: editorFromVal, to: editorToVal });
			} else {
				alert('Word must be a real 4 letter English word!');
			}
			setLoading(false);
		});
	}, [editorFromVal, editorToVal, setShowEditor, setLoading]);

	const handleCloseEditor = useCallback(() => {
		setShowEditor('hidden');
	}, [setShowEditor]);

	return (
		<div className={getThemeClassname('Solo', dark)}>
			<h2 className="Solo__words">
				From: {from} -> To: {to}
			</h2>
			<div className="Solo__btns">
				<button
					id="soloNewBtn"
					className="Solo__btn"
					aria-label="New Game"
					onClick={handleNewClick}
				>
					New Game
				</button>
				<button
					id="soloEditGameBtn"
					className="Solo__btn"
					aria-label="Edit Game"
					onClick={handleEditClick}
				>
					Edit Game
				</button>
			</div>

			{showEditor && (
				<div className={'Solo__editor  Solo__editor--' + showEditor}>
					<div className="Solo__editorContent">
						<div className="Solo__editorForms">
							<div className="Solo__editorForm">
								<label htmlFor="soloEditFromInput">From:</label>
								<input
									id="soloEditFromInput"
									className="Solo__EditorInput"
									type="text"
									maxLength={4}
									value={editorFromVal}
									onChange={handleChangeFromEditor}
								/>
							</div>
							<div className="Solo__editor--center">-></div>
							<div className="Solo__editorForm">
								<label htmlFor="soloEditToInput" className="Solo__editorLabel">
									To:
								</label>
								<input
									id="soloEditToInput"
									className="Solo__EditorInput"
									type="text"
									maxLength={4}
									value={editorToVal}
									onChange={handleChangeToEditor}
								/>
							</div>
						</div>
						<div className="Solo__editorBtns">
							<button
								id="soloEditorSubmitBtn"
								className="Solo__editorBtn"
								aria-label="Submit"
								onClick={handleSubmitEditor}
							>
								Submit
							</button>
							<button
								id="soloEditorCancelBtn"
								className="Solo__editorBtn"
								aria-label="Cancel"
								onClick={handleCloseEditor}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			<div>Bloop poop</div>

			{loading && createPortal(<Loading />, document.body)}
		</div>
	);
};

Solo.propTypes = {
	dark: PropTypes.bool,
	from: PropTypes.string,
	to: PropTypes.string,
	onChangeFrom: PropTypes.func,
	onChangeTo: PropTypes.func,
	onChangeGame: PropTypes.func,
};

export const mapStateToProps = ({
	game: {
		solo: { from, to },
	},
	theme: { dark },
}) => ({
	dark,
	from,
	to,
});

const mapDispatchToProps = {
	onChangeFrom: applyFrom,
	onChangeTo: applyTo,
	onChangeGame: applyGame,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Solo);
