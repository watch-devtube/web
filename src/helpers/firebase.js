import FirebaseConfig from "../../firebase.config.json";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

firebase.initializeApp(FirebaseConfig);
const firestore = firebase.firestore();

const authReady = () =>
  new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(
      user => {
        unsubscribe();
        resolve(user);
      },
      error => {
        unsubscribe();
        reject(error);
      }
    );
  });

const jwtToken = () =>
  new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      return resolve("");
    }
    user.getIdToken().then(
      tkn => resolve(tkn),
      error => reject(error)
    );
  });

export { firebase, firestore, authReady, jwtToken };
