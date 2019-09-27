import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Route, Router, Switch } from 'react-router';
import './index.css';
// import createBrowserHistory from 'history/createBrowserHistory';
import Login from './features/Login';
import Home from './features/Home';
import QrGen from './features/QrGen';

import * as serviceWorker from './serviceWorker';

const createBrowserHistory = require('history').createBrowserHistory;

const customHistory = createBrowserHistory();
const Root = () => (
  <Router history={customHistory}>
    {localStorage.getItem('displayName') ? (
      <Switch>
        <Route path="/app/home" component={Home} />
        <Route path="/qr" component={QrGen} />
      </Switch>
    ) : (
      <Switch>
        <Route path="/login" component={Login} />
        <Redirect to="/login" />
      </Switch>
    )}
  </Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
