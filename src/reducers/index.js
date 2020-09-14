import { combineReducers } from 'redux';

import daily from './DailyReducer';
import home from './HomeReducer';
import solo from './SoloReducer';
import theme from './ThemeReducer';

const rootReducer = combineReducers({ daily, home, solo, theme });

export default rootReducer;
