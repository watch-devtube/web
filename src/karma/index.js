import { api } from "../api";

const state = {
  karma: 0,
};

const actions = {
  initialize({ commit }, user) {
    if (user) {
      const [provider] = user.providerData;
      const what = window.btoa(
        provider.providerId + "/" + provider.email + "/" + provider.uid
      );
      api
        .get(`/api/karma`, { params: { user: what } })
        .then((response) => commit("init", response.data));
    } else {
      commit("init", { karma: 0 });
    }
  },
};
const mutations = {
  init: (state, { karma }) => {
    state.karma = karma;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
