import { api } from "../api";

const state = {
  popupVisible: false,
  video: undefined
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
      .then(() => dispatch("hidePopup"))
      .catch(() =>
        dispatch(
          "notify/error",
          {
            title: "Unable to save video",
            text: "Something went wrong on the server"
          },
          { root: true }
        )
      );
  },
  showPopup({ commit }, videoId) {
    api.get("/videos/" + videoId).then(({ data }) => {
      commit("videoFetched", data);
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
  videoFetched: (state, data) => {
    state.video = JSON.stringify(data, null, 2);
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
