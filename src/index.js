import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './App';
import Web3Reducer, { subscribe } from './reducers/Web3Reducer';
import InfoReducer from './reducers/InfoReducer';

import 'bootswatch/dist/darkly/bootstrap.min.css';
import './index.css';

const reducer = combineReducers({
  web3: Web3Reducer,
  warnings: InfoReducer,
});
const store = createStore(reducer, applyMiddleware(thunk));
subscribe(store.dispatch, store.getState);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
