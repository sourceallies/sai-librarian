import React from 'react';
import styled from 'styled-components';
import { RaisedButton } from '../elements';

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: purple;
`;

const appTokenKey = 'appToken'; // also duplicated in Login.js
export default class QrGen extends React.Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <h3>Welcome</h3>
        {/*<Avatar src={this.state.firebaseUser.user.photoURL}/>*/}

        <div>
          <RaisedButton>Sign Out</RaisedButton>
        </div>
      </div>
    );
  }
}
