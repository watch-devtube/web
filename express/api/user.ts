import * as admin from 'firebase-admin'

var serviceAccount = require('../firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://watchdevtube.firebaseio.com'
})

export class User {
  
  jwtToken: string
  
  constructor(jwtToken) {
    this.jwtToken = jwtToken
  }

  uid() {
    return admin.auth().verifyIdToken(this.jwtToken).then(decodedToken => decodedToken.uid)
  }
}