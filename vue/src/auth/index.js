import Cookies from "js-cookie";

let state = {
  loading: true,
  user: undefined,
  error: undefined,
  loginInProgress: false
};

let getters = {
  jwtToken: () => {
    return Cookies.get("devtube-jwt");
  },
  authEnabled: () => {
    return Cookies.get("auth-enabled");
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
  login({ commit }, progress) {
    commit("login", progress);
  },
  logout() {
    Cookies.remove("devtube-jwt");
    location.reload();
  }
};

let mutations = {
  login: (state, progress) => {
    state.loginInProgress = progress;
  },
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
