import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home.jsx';
import Solo from './components/Solo.jsx';
import NotFound from './components/NotFound.jsx';

import './App.less';

export const App = () => (
	<Switch>
		<Route exact path="/" component={Home} />
		<Route path="/solo" component={Solo} />
		<Route component={NotFound} />
	</Switch>
);

export default App;
