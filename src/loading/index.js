let state = {};

let getters = {
  completed: (state, getters, rootState) =>
    !rootState.videos.loading && !rootState.auth.loading,
};

let mutations = {};

let actions = {};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
