import React from 'react';

import './Versus.less';

export const Versus = () => {
	return (
		<div className="Versus">
			<h1>Versus</h1>

			<div>
				<label>Code: </label>
				<input placeholder="XXXX" />

				<label>Name: </label>
				<input placeholder="Name" />

				<button>Join</button>

				<button>Create</button>
			</div>
		</div>
	);
};

export default Versus;
