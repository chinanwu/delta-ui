import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

// Lazy loads
const Daily = lazy(() => import('./components/Daily.jsx'));
const Home = lazy(() => import('./components/Home.jsx'));
const NotFound = lazy(() => import('./components/NotFound.jsx'));
const Solo = lazy(() => import('./components/Solo.jsx'));

import './App.less';

export const App = () => (
	<Switch>
		<Route exact path="/" component={Home} />
		<Route path="/solo" component={Solo} />
		<Route path="/daily" component={Daily} />
		<Route component={NotFound} />
	</Switch>
);

export default App;
