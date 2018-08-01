import Auth0Lock from 'auth0-lock'
import AuthConfig from './AuthConfig.json'
// import EventEmitter from 'eventemitter3'
import Router from 'vue-router'

export default class AuthService {
  // authenticated = this.isAuthenticated()
  // router = new Router()

  constructor () {
    this.lock = new Auth0Lock(AuthConfig.clientId, AuthConfig.domain, AuthConfig)  
    this.lock.on('authenticated', this.setSession.bind(this))
    this.lock.on('authorization_error', error => console.log(error))

    this.login = this.login.bind(this)
    this.setSession = this.setSession.bind(this)
    this.getAccessToken = this.getAccessToken.bind(this)
    this.getProfile = this.getProfile.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
  }

  login () {
    this.lock.show()
  }

  setSession (authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      let expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      )
      this.$cookie.set('access_token', authResult.accessToken)
      this.$cookie.set('id_token', authResult.idToken)
      this.$cookie.set('expires_at', expiresAt)
    }
  }

  getAccessToken () {
    const accessToken = this.$cookie.get('access_token')
    if (!accessToken) {
      throw new Error('No access token found')
    }
    return accessToken
  }

  getProfile (cb) {
    let accessToken = this.getAccessToken()
    let self = this
    this.lock.getUserInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile
      }
      cb(err, profile)
    })
  }

  logout () {
    this.$cookie.delete('access_token')
    this.$cookie.delete('id_token')
    this.$cookie.delete('expires_at')
  }

  isAuthenticated () {
    let expiresAt = JSON.parse(this.$cookie.get('expires_at'))
    return new Date().getTime() < expiresAt
  }

}