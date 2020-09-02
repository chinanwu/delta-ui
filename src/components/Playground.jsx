import React, { useCallback, useState } from 'react';

import './Playground.less';
import WinModal from './WinModal.jsx';

export const Playground = () => {
	return (
		<div>
			<WinModal
				from="heat"
				to="cold"
				playerSoln={['heat', 'meat', 'mead', 'meld', 'mold', 'cold']}
				timer={6169}
				hintsUsed={1}
				score={1234}
			/>
		</div>
	);
};

export default Playground;
