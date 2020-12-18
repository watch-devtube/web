import { apiAxios } from "../api";

let state = {};

let actions = {
  putALike(context, videoId) {
    return apiAxios().then(api => api.post(`/liking/likes/${videoId}`, {}));
  },
  putADislike(context, videoId) {
    return apiAxios().then(api => api.post(`/liking/dislikes/${videoId}`, {}));
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
