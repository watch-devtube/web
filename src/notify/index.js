export default {
  namespaced: true,
  state: {
    show: false,
    title: "",
    text: "",
    type: "",
  },
  actions: {
    error(context, state) {
      context.commit("error", state);
    },
  },
  mutations: {
    error(
      state,
      {
        error,
        text = "Please see logs and submit an issue: bit.ly/devtube-issue",
        title = "Something went wrong!",
        duration = undefined,
      }
    ) {
      state.show = true;
      state.title = title;
      state.text = text;
      state.type = "error";
      state.duration = duration;
      console.error(error);
    },
    disableNotify(state) {
      state.show = false;
    },
  },
};
