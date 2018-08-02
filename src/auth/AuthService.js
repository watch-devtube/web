import Auth0Lock from 'auth0-lock'
import AuthConfig from './AuthConfig.json'

export default class AuthService {
  constructor () {
  }

  signIn() {
    let lock = new Auth0Lock(AuthConfig.clientId, AuthConfig.domain, AuthConfig)
    return this.authenticate(lock).then(response => { 
      let [auth, err] = response
      if (err) {
        return Promise.resolve(response)
      } else {
        return this.profile(lock, auth) 
      }
    })
  }

  isExpired(tokenExpiration) {
    let expiresAt = new Number(tokenExpiration)
    return new Date().getTime() < expiresAt
  }

  authenticate(lock) {
    return new Promise((resolve, _) => {
      lock.on('authenticated', (auth) => {
        console.log(auth)
        let {accessToken, idToken} = auth
        if (accessToken && idToken) {
          let expiresAt = auth.expiresIn * 1000 + new Date().getTime()
          let response = { accessToken: accessToken, idToken : idToken, expiresAt : expiresAt }
          resolve([response, null])
        } else {
          resolve([null, 'Ooops, something went wrong!'])
        }
      })  
      lock.show()      
    })
  }

  profile(lock, auth) {
    return new Promise((resolve, _) => {
      lock.getUserInfo(auth.accessToken, (err, profile) => {
        resolve([{...profile, ...auth}, err])
      })
    })
  }

}