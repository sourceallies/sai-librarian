import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import userManager from '../auth/user-manager';
import wrapWithAuth from '../auth/wrap-with-auth';
import Home from './Home';
import Books from './Books';
import Qr from './Qr';
import OAuthCallback from './OAuthCallback';
import BookList from "./BookList";
const { createBrowserHistory } = require('history');

const Routes = () => (
  <Router history={createBrowserHistory()}>
    <Switch>
      <Route path="/app/home" component={wrapWithAuth(Home)} />
      <Route path="/books/:id" component={wrapWithAuth(Books)} />
        <Route path="/books" component={wrapWithAuth(BookList)} />
        <Route path="/app/qr" component={wrapWithAuth(Qr)} />
      <Route path="/implicit/callback" component={OAuthCallback} />
    </Switch>
  </Router>
);

export default Routes;
