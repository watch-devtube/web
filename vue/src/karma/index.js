import { bucket } from "../api";

const state = {
  karma: 0
};

const actions = {
  initialize({ commit }, user) {
    if (!user) {
      commit("init", { karma: 0 });
      return;
    }

    const [userInfo] = user.providerData;
    bucket
      .get("board.json")
      .then(({ data }) => commit("init", karma(userInfo, data.contributors)));
  }
};
const mutations = {
  init: (state, { karma }) => {
    state.karma = karma;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};

const karma = ({ uid = "", email = "" }, contributors) => {
  const contributor = contributors.find(
    each => each.email === email || uidOf(each) === uid
  );
  return { karma: contributor?.karma || 0 };
};

const uidOf = contributor => {
  const [, uid] = contributor.avatar.match(
    /githubusercontent.com\/u\/(\d+).*$/
  );
  return uid;
};
