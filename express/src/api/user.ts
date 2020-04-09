
import * as admin from 'firebase-admin'
import * as serviceAccount from '../../firebase.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://watchdevtube.firebaseio.com'
})

export class User {

  jwtToken: string

  constructor(jwtToken) {
    this.jwtToken = jwtToken
  }

  async uid() {
    return admin.auth().verifyIdToken(this.jwtToken).then(decodedToken => decodedToken.uid)
  }

}
