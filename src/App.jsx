import loadable from '@loadable/component';
import React from 'react';
import { Switch, Route } from 'react-router-dom';

const Daily = loadable(() =>
	import(/* webpackChunkName:"Daily" */ './components/Daily/DailyV2.jsx')
);
const Home = loadable(() =>
	import(/* webpackChunkName:"Home" */ './components/Home.jsx')
);
const NotFound = loadable(() =>
	import(/* webpackChunkName:"NotFound" */ './components/NotFound.jsx')
);
const Solo = loadable(() =>
	import(/* webpackChunkName:"Solo" */ './components/Solo/SoloV3.jsx')
);

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

// TODO:
// - onFocus styling, :focus-visible?
// - TabIndex order

// Potential future improvements:
// - Modal component
// - Theme context
// - Section tags where applicable
// - HOC timer wrapper
// - Better link colouring (:link, :visited, :focus)
