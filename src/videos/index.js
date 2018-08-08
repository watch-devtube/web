import {firestore} from '../helpers/firebase'

let state = {
  loading: true,
  watched: [],
  favorites: []
}

let userVideos = (id) => {
  return firestore.collection('videos').doc(id)  
}

let actions = {
  initialize({commit}, user) {
    if (user) {
      userVideos(user.uid).get()
        .then(snapshot => { commit('init', snapshot.data()) })
        .catch(error => { commit("notify/error", { error: error }, { root: true })})
    } else {
      commit('init', { watched: [], favorites: [] })
    }
  },
  toggleFavorite({commit, state, rootState}, videoId) {
   
    let video = {
      videoId: videoId,
      timestamp: new Date().getTime()
    }

    let isFavorited = state.favorites.some(it => it.videoId == videoId)
    let newVideos = isFavorited 
      ? state.favorites.filter(it => it.videoId != videoId) 
      : state.favorites.concat([video])
      
    userVideos(rootState.auth.user.uid).set({favorites: newVideos, watched : state.watched})
      .then(ok => { commit('changeFavorites', newVideos) })
      .catch(error => { commit("notify/error", { error: error }, { root: true }) })

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

    userVideos(rootState.auth.user.uid).set({watched: newVideos, favorites: state.favorites})
      .then(ok => { commit('changeWatched', newVideos) })
      .catch(error => { commit("notify/error", { error: error }, { root: true }) })
  }
}

let getters = {
  isWatched: state => videoId => state.watched.some(item => item.videoId == videoId),
  isFavorite: state => videoId => state.favorites.some(item => item.videoId == videoId),

  watchedIds: state => state.watched.map(video => video.videoId).filter(video => video != undefined),
  favoriteIds: state => state.favorites.map(video => video.videoId).filter(video => video != undefined),

  watchedCount: (state, getters) => getters.watchedIds.length,
  favoriteCount: (state, getters) => getters.favoriteIds.length
}

let mutations = {
  init: (state, initial) => {
    if (initial) {
      state.watched = initial.watched
      state.favorites = initial.favorites || []
    }
    state.loading = false
  },
  noLoading: (state) => {
    state.loading = false
  },
  changeWatched: (state, watched) => {
    state.watched = watched
  },
  changeFavorites: (state, favorites) => {
    state.favorites = favorites
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}