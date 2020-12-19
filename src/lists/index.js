import { bucket } from "../api";

const state = {
  channels: [],
  speakers: []
};

const actions = {
  initialize({ commit }) {
    bucket
      .get("/categories.json")
      .then(response => commit("init", response.data));
  }
};
const mutations = {
  init: (state, lists) => {
    state.channels = lists.channels;
    state.speakers = lists.speakers;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
