import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import userManager from '../auth/user-manager';
import wrapWithAuth from '../auth/wrap-with-auth';
import Home from './Home';
import Book from './Book';
import Qr from './Qr';
import OAuthCallback from './OAuthCallback';
const { createBrowserHistory } = require('history');

const Routes = () => (
  <Router history={createBrowserHistory()}>
    <Switch>
      <Route path="/app/home" component={wrapWithAuth(Home)} />
      <Route path="/book/:id" component={wrapWithAuth(Book)} />
      <Route path="/app/qr" component={wrapWithAuth(Qr)} />
      <Route path="/implicit/callback" component={OAuthCallback} />
    </Switch>
  </Router>
);

export default Routes;
