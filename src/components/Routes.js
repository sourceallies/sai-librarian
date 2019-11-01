import React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import AWS from 'aws-sdk';
import { makeAuthenticator, Callback } from 'react-oidc';
import userManager from '../auth/user-manager';
import '../configuredDocumentClient';
import Books from './Books';
import BookList from "./BookList";
import BookAddSuccess from "./BookAddSuccess";
import BulkAddPage from './bulk-add/BulkAddPage';
import GenerateLabelFile from './GenerateLabelFile';
const { createBrowserHistory } = require('history');

const wrapWithAuth = makeAuthenticator({userManager});

const Routes = () => (
  <Router history={createBrowserHistory()}>
    <Switch>
      <Route exact path="/">
        <Redirect to="/books" />
      </Route>
      <Route path="/books/:id" component={wrapWithAuth(Books)} />
      <Route path="/books" component={wrapWithAuth(BookList)} />
      <Route path="/success" component={wrapWithAuth(BookAddSuccess)} />
      <Route path="/bulk-add" component={wrapWithAuth(BulkAddPage)} />
      <Route path="/label-file" component={wrapWithAuth(GenerateLabelFile)} />
      <Route path="/implicit/callback" render={({history}) => (
        <Callback
          userManager={userManager}
          onSuccess={(user) => {
            console.log('user authenticated', user);
            AWS.config.credentials.params.WebIdentityToken = user.id_token;
            history.push('/');
          }}
        />
      )} />
    </Switch>
  </Router>
);

export default Routes;
