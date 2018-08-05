import {firestore} from '../helpers/firebase'

let state = {
  loading: true,
  watched: []
}

let actions = {
  initialize({commit}, user) {
    if (user) {
      firestore.collection('videos').doc(user.uid).get()
        .then(snapshot => {
          commit('init', snapshot.data()) })
        .catch(error => {
          commit("notify/error", { error: error }, { root: true })
        })
    } else {
      commit('init', { watched: [] })
    }
  },
  toggleWatched({commit, state, rootState}, videoId) {

    let video = {
      videoId: videoId,
      timestamp: new Date().getTime()
    }

    let isWatched = state.watched.some(it => it.videoId == videoId)
    let newVideos = isWatched 
      ? state.watched.filter(it => it.videoId != videoId) 
      : state.watched.concat([video])
    firestore.collection('videos').doc(rootState.auth.user.uid).set({watched: newVideos})
      .then(ok => {
        commit('changeWatched', newVideos)  
      })
      .catch(error => {
        commit("notify/error", { error: error }, { root: true })
      })
  }
}

let getters = {
  isWatched: state => videoId => state.watched.some(item => item.videoId == videoId),
  watchedIds: state => state.watched.map(video => video.videoId).filter(video => video != undefined),
  watchedCount: (state, getters) => getters.watchedIds.length
}

let mutations = {
  init: (state, initial) => {
    if (initial) {
      state.watched = initial.watched
      
    }
    state.loading = false
  },
  noLoading: (state) => {
    state.loading = false
  },
  setWatched: (state, watched) => {
    state.watched = watched
  },
  changeWatched: (state, watched) => {
    state.watched = watched
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}