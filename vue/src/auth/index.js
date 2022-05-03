import { apiUrl, api } from "../api";

const state = {
  popupVisible: false,
  loggedIn: false,
  admin: false,
  avatar: undefined
};

const getters = {
  isLoggedIn: state => state.loggedIn,
  isAdmin: state => state.admin,
  isPopupVisible: state => state.popupVisible
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
    window.location.href = apiUrl + "/auth/" + provider;
  },
  logout() {
    window.location.href = apiUrl + "/auth/logout";
  }
};

const mutations = {
  loggedIn: (state, { loggedIn, admin, avatar }) => {
    state.loggedIn = loggedIn;
    state.avatar = avatar;
    state.admin = admin;
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
