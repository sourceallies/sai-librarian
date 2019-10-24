import React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import wrapWithAuth from '../auth/wrap-with-auth';
import Books from './Books';
import OAuthCallback from './OAuthCallback';
import BookList from "./BookList";
import BookAddSuccess from "./BookAddSuccess";
import BulkAddPage from './bulk-add/BulkAddPage';
const { createBrowserHistory } = require('history');

const Routes = () => (
  <Router history={createBrowserHistory()}>
    <Switch>
      <Route exact path="/">
        <Redirect to="/books" />
      </Route>
      <Route path="/books/:id" component={wrapWithAuth(Books)} />
      <Route path="/books" component={wrapWithAuth(BookList)} />
      <Route path="/implicit/callback" component={OAuthCallback} />
      <Route path="/success" component={wrapWithAuth(BookAddSuccess)} />
      <Route path="/scan" component={BulkAddPage} />

    </Switch>
  </Router>
);

export default Routes;
