import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import wrapWithAuth from '../auth/wrap-with-auth';
import Home from './Home';
import Books from './Books';
import Qr from './Qr';
import OAuthCallback from './OAuthCallback';
import BookList from "./BookList";
import BookAddSuccess from "./BookAddSuccess";
import Another from "./Another";
const { createBrowserHistory } = require('history');

const Routes = () => (
  <Router history={createBrowserHistory()}>
    <Switch>
      <Route path="/app/home" component={wrapWithAuth(Home)} />
      <Route path="/another" component={wrapWithAuth(Another)} />
      <Route path="/books/:id" component={wrapWithAuth(Books)} />
      <Route path="/books" component={wrapWithAuth(BookList)} />
      <Route path="/app/qr" component={wrapWithAuth(Qr)} />
      <Route path="/implicit/callback" component={OAuthCallback} />
      <Route path="/success" component={wrapWithAuth(BookAddSuccess)} />
    </Switch>
  </Router>
);

export default Routes;
