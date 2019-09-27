import React from 'react';
import styled from 'styled-components';
import { logout } from '../helpers/auth';
import { RaisedButton } from '../elements';

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: purple;
`;

const appTokenKey = 'appToken'; // also duplicated in Login.js
export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //firebaseUser: JSON.parse(localStorage.getItem("firebaseUser"))
    };

    //console.log("User:", this.state.firebaseUser);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    console.log('trying to log out');
    logout().then(
      function() {
        localStorage.removeItem(appTokenKey);
        this.props.history.push('/login');
        console.log('user signed out from firebase');
      }.bind(this)
    );
  }

  render() {
    return (
      <div>
        <h1>Home</h1>
        <h3>Welcome</h3>
        {/*<Avatar src={this.state.firebaseUser.user.photoURL}/>*/}
        {localStorage.getItem('displayName')}

        <div>
          <RaisedButton onClick={this.handleLogout}>Sign Out</RaisedButton>
        </div>
      </div>
    );
  }
}
