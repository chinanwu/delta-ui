import React, { useCallback } from 'react';

export const Playground = () => {
	const test = useCallback(() => {
		console.log('change');
	}, []);

	return (
		<div>
			<input placeholder="test" onChange={test} />
		</div>
	);
};

export default Playground;
