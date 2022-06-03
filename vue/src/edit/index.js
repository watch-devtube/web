import { api } from "../api";

const state = {
  popupVisible: false,
  video: undefined,
  speakers: []
};

const getters = {
  isPopupVisible: state => state.popupVisible
};

const actions = {
  saveVideo({ state, dispatch }, { tweet }) {
    const newVideo = JSON.parse(state.video);
    const videoId = newVideo.objectID;
    api
      .put("/videos/" + videoId, { newVideo, tweet })
      .then(() => dispatch("hidePopup"));
  },
  showPopup({ commit }, videoId) {
    api.get("/videos/" + videoId + "/edit").then(({ data }) => {
      commit("editReady", data);
      commit("popupVisible", true);
      const classes = document.documentElement.classList;
      classes?.add("is-clipped");
    });
  },
  hidePopup({ commit }) {
    commit("popupVisible", false);
    const classes = document.documentElement.classList;
    classes?.remove("is-clipped");
  }
};

const mutations = {
  editVideo: (state, data) => {
    state.video = data;
  },
  editReady: (state, { video, speakers }) => {
    state.video = video;
    state.speakers = speakers;
  },
  popupVisible: (state, visible) => {
    state.popupVisible = visible;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
