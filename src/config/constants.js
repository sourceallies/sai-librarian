import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCKDrIsxJu6b2FOMCEiAaJFyQ_J-GWR1WM',
  authDomain: 'librarian-a2d3e.firebaseapp.com',
  databaseURL: 'https://hhimanshu-test.firebaseio.com'
};

firebase.initializeApp(config);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
