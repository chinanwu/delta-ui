import loadable from '@loadable/component';
import React from 'react';
import { Switch, Route } from 'react-router-dom';

const Daily = loadable(() =>
	import(/* webpackChunkName:"Daily" */ './components/Daily/Daily.jsx')
);
const Home = loadable(() =>
	import(/* webpackChunkName:"Home" */ './components/Home.jsx')
);
const NotFound = loadable(() =>
	import(/* webpackChunkName:"NotFound" */ './components/NotFound.jsx')
);
const Solo = loadable(() =>
	import(/* webpackChunkName:"Solo" */ './components/Solo/Solo.jsx')
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
// - Button links have a weird double focus - i.e. it focuses on the Link as well as the inner button,
// so it takes two tabs to get away from it.
// - Pull out duplicate input styling (scrollbar stuff specifically)

// Potential future improvements:
// - Ability to only enter 1 letter in the Guess and have it "filled in" in the backend w the other words.
// - Theme context
// - Section tags where applicable
// - HOC timer wrapper
// - Better link colouring (:link, :visited, :focus)
// - Fun facts toast
