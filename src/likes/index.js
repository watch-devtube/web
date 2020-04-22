import { apiAxios } from "../api";

let state = {};

let actions = {
  putALike(context, videoId) {
    return apiAxios().then(api =>
      api.post(`/api2/videos/${videoId}/likes`, {})
    );
  },
  putADislike(context, videoId) {
    return apiAxios().then(api =>
      api.post(`/api2/videos/${videoId}/dislikes`, {})
    );
  }
};

let getters = {};

let mutations = {};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
