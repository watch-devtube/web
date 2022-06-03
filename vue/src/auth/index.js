import { apiUrl, api } from "../api";

const state = {
  popupVisible: false,
  loggedIn: false,
  youtubeAccess: false,
  admin: false,
  avatar: undefined,
  username: undefined,
  karma: 0
};

const getters = {
  isLoggedIn: state => state.loggedIn,
  isAdmin: state => state.admin,
  isPopupVisible: state => state.popupVisible,
  hasYoutubeAccess: state => state.youtubeAccess
};

const actions = {
  bootstrap({ commit }) {
    api.get("/auth/loggedIn").then(({ data }) => commit("loggedIn", data));
  },
  showPopup({ commit }) {
    commit("popupVisible", true);
    const classes = document.documentElement.classList;
    classes?.add("is-clipped");
  },
  hidePopup({ commit }) {
    commit("popupVisible", false);
    const classes = document.documentElement.classList;
    classes?.remove("is-clipped");
  },
  // eslint-disable-next-line no-unused-vars
  login({ commit }, provider) {
    window.location.href =
      apiUrl + "/auth/" + provider + "?returnTo=" + window.location.href;
  },
  logout() {
    window.location.href =
      apiUrl + "/auth/logout" + "?returnTo=" + window.location.href;
  }
};

const mutations = {
  loggedIn: (
    state,
    { loggedIn, admin, avatar, username, karma, youtubeAccess }
  ) => {
    state.loggedIn = loggedIn;
    state.username = username;
    state.avatar = avatar;
    state.admin = admin;
    state.karma = karma;
    state.youtubeAccess = youtubeAccess;
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
