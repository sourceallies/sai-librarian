import React from 'react';
import { RaisedButton } from '../elements';
import { loginWithGoogle } from '../helpers/auth';
import { firebaseAuth } from '../config/constants';

const firebaseAuthKey = 'firebaseAuthInProgress';
const appTokenKey = 'appToken';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      splashScreen: false
    };

    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
  }

  handleGoogleLogin() {
    loginWithGoogle().catch(function(error) {
      alert(error); // or show toast
      localStorage.removeItem(firebaseAuthKey);
    });
    localStorage.setItem(firebaseAuthKey, '1');
  }

  componentWillMount() {
    if (localStorage.getItem(appTokenKey)) {
      this.props.history.push('/app/home');
      return;
    }

    firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        console.log('User signed in: ', JSON.stringify(user));

        localStorage.removeItem(firebaseAuthKey);

        // here you could authenticate with you web server to get the
        // application specific token so that you do not have to
        // authenticate with firebase every time a user logs in
        localStorage.setItem(appTokenKey, user.uid);

        // store the token
        this.props.history.push('/app/home');
      }
    });
  }

  render() {
    console.log('User Info');
    console.log(firebaseAuthKey);
    console.log('User Info from local storage');
    console.log(localStorage.getItem(firebaseAuthKey));
    if (localStorage.getItem(firebaseAuthKey) === '1') return <SplashScreen />;
    return <LoginPage handleGoogleLogin={this.handleGoogleLogin} />;
  }
}

const iconStyles = {
  color: '#ffffff'
};

const LoginPage = ({ handleGoogleLogin }) => (
  <div>
    <h1>Login</h1>
    <div>
      <RaisedButton onClick={handleGoogleLogin}>
        Sign in with Google
      </RaisedButton>
    </div>
  </div>
);
const SplashScreen = () => <p>Loading...</p>;
