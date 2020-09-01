import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home.jsx';
import Playground from './components/Playground.jsx';
// import Solo from './components/Solo.jsx';
import Solov2 from './components/Solov2.jsx';
import NotFound from './components/NotFound.jsx';

import './App.less';

export const App = () => (
	<Switch>
		<Route exact path="/" component={Home} />
		<Route path="/solo2" component={Solov2} />
		{/*<Route path="/solo" component={Solo} />*/}
		<Route path="/playground" component={Playground} />
		<Route component={NotFound} />
	</Switch>
);

export default App;
