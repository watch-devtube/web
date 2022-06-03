import { api } from "../api";

const state = {
  favorites: [],
  watched: [],
  later: [],
  subscribedToWeekly: false
};

const actions = {
  bootstrap({ commit }) {
    api.get("/user/bootstrap").then(({ data }) => commit("bootstrap", data));
  },
  async add({ commit }, { list, videoID }) {
    return api
      .post("/user/lists/" + list + "/" + videoID)
      .then(({ data }) => commit("updated", { list, data }));
  },
  async remove({ commit }, { list, videoID }) {
    return api
      .delete("/user/lists/" + list + "/" + videoID)
      .then(({ data }) => commit("updated", { list, data }));
  },
  async subscribeWeekly({ commit }) {
    return api
      .post("/user/weekly-subscription")
      .then(() => commit("subscribedWeekly", true));
  },
  async unsubscribeWeekly({ commit }) {
    return api
      .delete("/user/weekly-subscription")
      .then(() => commit("subscribedWeekly", false));
  }
};

const mutations = {
  subscribedWeekly: (state, yesNo) => {
    state.subscribedToWeekly = yesNo;
  },
  updated: (state, { list, data }) => {
    state[list] = [...data];
  },
  bootstrap: (
    state,
    { favorites = [], watched = [], later = [], subscribedToWeekly = false }
  ) => {
    state.favorites = favorites;
    state.watched = watched;
    state.later = later;
    state.subscribedToWeekly = subscribedToWeekly;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
