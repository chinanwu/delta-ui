import React from 'react';
import MoonLoader from 'react-spinners/ClipLoader';

import './Loading.less';

export const Loading = () => {
	return (
		<div className="Loading" role="alert" aria-busy="true">
			<MoonLoader loading={true} />
		</div>
	);
};

export default Loading;
