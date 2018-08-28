import {firebase} from '../helpers/firebase'

let authProviders = {
  google: {
    name: firebase.auth.GoogleAuthProvider
  },
  github: {
    name: firebase.auth.GithubAuthProvider
  },
  twitter: {
    name: firebase.auth.TwitterAuthProvider
  }
};

let state = {
  loading: true,
  user: undefined,
  error: undefined
}

let getters = {
  
}

let actions = {
  clearError ({commit}) {
    commit('clearError')
  },
  setError ({commit}, payload) {
    commit('setError', payload)
  },  
  signOut() {
    firebase.auth().signOut()
    location.reload()
  },
  autoSignIn ({commit}, payload) {
    if (payload) {
      payload.getIdToken().then(token => {
        commit('setUser', {
          id: payload.uid,
          name: payload.displayName,
          email: payload.email,
          photoUrl: payload.photoURL,
          uid: payload.uid,
          tkn: token
        })
      })
    } else {
      commit('setUser', undefined)
    }

  },  
  signIn({commit}, providerName) {
    commit('clearError')
    let providerInfo = authProviders[providerName]
    let provider = new (providerInfo.name)()
    firebase.auth().signInWithPopup(provider)
      .then(user => location.reload())
      .catch(error => {
          if (error.code == "auth/popup-closed-by-user") {
            return
          }
          commit('setError', error)
          commit("notify/error", { error: error }, { root: true })
        }
      )
  }
}

let mutations = {
  setUser: (state, user) => {
    state.user = user
    state.loading = false
  },
  setError (state, payload) {
    state.error = payload
    state.loading = false
  },
  clearError (state) {
    state.error = null
    state.loading = false
  }  
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}