import React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import wrapWithAuth from '../auth/wrap-with-auth';
import Books from './Books';
import BookCreate from './BookCreate';
import OAuthCallback from './OAuthCallback';
import BookList from "./BookList";
import BookAddSuccess from "./BookAddSuccess";
import BulkAddPage from './bulk-add/BulkAddPage';
import GenerateLabelFile from './GenerateLabelFile';
const { createBrowserHistory } = require('history');

const Routes = () => (
  <Router history={createBrowserHistory()}>
    <Switch>
      <Route exact path="/">
        <Redirect to="/books" />
      </Route>
      <Route path="/books/:id/create" component={wrapWithAuth(BookCreate)} />
      <Route path="/books/:id" component={wrapWithAuth(Books)} />
      <Route path="/books" component={wrapWithAuth(BookList)} />
      <Route path="/success" component={wrapWithAuth(BookAddSuccess)} />
      <Route path="/bulk-add" component={wrapWithAuth(BulkAddPage)} />
      <Route path="/label-file" component={wrapWithAuth(GenerateLabelFile)} />
      <Route path="/implicit/callback" component={OAuthCallback} />
    </Switch>
  </Router>
);

export default Routes;
