import AuthService from './AuthService'

let authService = new AuthService()

let state = {
  user: undefined,
  error: ''
}

let getters = {
  isExpired: (state) => authService.isExpired(state.user.idToken)
}

let actions = {
  logout({commit}) {
   commit('logout') 
  },
  async login({dispatch, commit}) {
    let [user, error] = await dispatch('signIn')
    if (error) { 
      commit('failure', error)
    } else {
      commit('success', user)
    }
  },
  signIn() {
    return authService.signIn()
  }
}

let mutations = {
  "logout": (state) => {
    state.user = undefined
  },
  "success": (state, user) => {
    state.user = user
  },
  "failure": (state, {error}) => {
    state.error = error
  }  
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}