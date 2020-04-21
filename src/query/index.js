let state = {
  sortOrder: "-satisfaction",
  lang: undefined
};

let getters = {};

let mutations = {
  sort: (state, sortOrder) => {
    state.sortOrder = sortOrder;
  },
  lang: (state, lang) => {
    state.lang = lang;
  }
};

let actions = {
  sort({ commit }, sortOrder) {
    commit("sort", sortOrder);
  },
  lang({ commit }, lang) {
    commit("lang", lang);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
