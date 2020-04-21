import { api } from "../api";

let state = {};

let actions = {
  putALike({ rootState }, videoId) {
    let tkn = rootState.auth.user.tkn;
    return api.post(
      `/api2/videos/${videoId}/likes`,
      {},
      {
        headers: { auth: tkn },
      }
    );
  },
  putADislike({ rootState }, videoId) {
    let tkn = rootState.auth.user.tkn;
    return api.post(
      `/api2/videos/${videoId}/dislikes`,
      {},
      {
        headers: { auth: tkn },
      }
    );
  },
};

let getters = {};

let mutations = {};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
