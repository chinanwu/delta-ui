import React, { useEffect } from 'react';

export default title => CandyComponent => () => {
	useEffect(() => {
		document.title = `${title} - Delta`;
	}, []);

	return <CandyComponent />;
};

// Candy is the innard of the wrapper (makes sense hey?)
