let state = {
  loading: true,
  user: undefined,
  error: undefined
};

let getters = {
  isSignedIn: state => {
    return !!state.user;
  }
};

let actions = {
  loginRequired({ commit }) {
    commit("notify/error", { error: "Login required." }, { root: true });
  },
  clearError({ commit }) {
    commit("clearError");
  },
  setError({ commit }, payload) {
    commit("setError", payload);
  },
  signOut() {
    location.reload();
  }
};

let mutations = {
  setUser: (state, user) => {
    state.user = user;
    state.loading = false;
  },
  setError(state, payload) {
    state.error = payload;
    state.loading = false;
  },
  clearError(state) {
    state.error = null;
    state.loading = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
