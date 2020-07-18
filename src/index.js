import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { themeStyle } from './Themes';
import {register as serviceWorker} from './serviceWorker';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './store/reducer';

let store = createStore(combineReducers({ system: reducer }), applyMiddleware(thunk));
// const unsubscribe = store.subscribe(() => { console.log(store.getState()); });

ReactDOM.render(  
  <MuiThemeProvider theme={themeStyle}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
serviceWorker();
