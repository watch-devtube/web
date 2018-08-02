let state = {
  watched: []
}

let actions = {
  toggleWatched({commit}, videoId) {
   commit('toggleWatched', videoId) 
  }
}

let getters = {
  isWatched: state => videoId => state.watched.some(item => item.videoId == videoId),
  watchedIds: state => state.watched.map(video => video.videoId).filter(video => video != undefined)
}

let mutations = {
  "toggleWatched": (state, videoId) => {
    let isWatched = state.watched.some(item => item.videoId == videoId)
    if (!isWatched) {
      state.watched.push({
        videoId: videoId,
        timestamp: new Date().getTime()
      })
    } else {
      state.watched = state.watched.filter(item => item.videoId != videoId)
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}