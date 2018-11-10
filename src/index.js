import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'normalize.css';
import './index.css';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import counterApp from './reducers';

import { resizeWindow } from './actions';

const store = createStore(counterApp);

window.addEventListener('load', () => {
  store.dispatch(resizeWindow(window.innerWidth, window.innerHeight));
});
window.addEventListener('resize', () => {
  store.dispatch(resizeWindow(window.innerWidth, window.innerHeight));
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
