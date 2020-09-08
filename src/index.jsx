import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App.jsx';
import { store } from './store';

import Loading from './components/Loading.jsx';

ReactDOM.render(
	<Provider store={store}>
		<Suspense fallback={<Loading />}>
			<Router>
				<App />
			</Router>
		</Suspense>
	</Provider>,
	document.getElementById('root')
);
