let state = {
  sortOrder: '-featured'
}

let getters = {
  
}

let mutations = {
  sort: (state, sortOrder) => {
    state.sortOrder = sortOrder
  },  
}

let actions = {
  sort({commit}, sortOrder) {
    commit('sort', sortOrder) 
   },  
}


export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}