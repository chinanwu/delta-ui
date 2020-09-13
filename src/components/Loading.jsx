import React from 'react';
import MoonLoader from 'react-spinners/ClipLoader';

import './Loading.less';

export const Loading = () => {
	return (
		<div className="Loading" role="alert" aria-busy="true">
			<MoonLoader color="#ffffff" loading={true} />
		</div>
	);
};

export default Loading;

// TODO:
// - Look into how to make this more accessible
