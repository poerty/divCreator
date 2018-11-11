import { combineReducers, } from 'redux';

import mainReducer from './mainReducer';

const counterApp = combineReducers({
  mainReducer,
});

export default counterApp;
