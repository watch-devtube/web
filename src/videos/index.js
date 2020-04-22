import { apiAxios } from "../api";

let state = {
  subscriptions: [],
  loading: true,
  watched: [],
  favorites: []
};

let userVideos = () => apiAxios().then(api => api.get("api/myvideos"));

let newUserVideos = data =>
  apiAxios().then(api => api.post("api/myvideos", data));

let actions = {
  initialize({ commit }, user) {
    if (user) {
      userVideos()
        .then(({ data }) => {
          commit("init", data);
        })
        .catch(error => {
          commit("notify/error", { error }, { root: true });
        });
    } else {
      commit("init", { watched: [], favorites: [] });
    }
  },
  toggleSpeakerSubscription({ dispatch }, speaker) {
    dispatch("toggleSubscription", { topic: speaker, type: "speaker" });
  },
  toggleSubscription({ commit, getters, rootGetters }, sub) {
    const signedIn = rootGetters["auth/isSignedIn"];
    if (!signedIn) {
      commit(
        "notify/error",
        { text: "You have to login first.", title: "", duration: 3000 },
        { root: true }
      );
      return;
    }

    let toggledSubscription = it =>
      it.topic == sub.topic && it.type == sub.type;
    let isSubscribed = getters.hasSubscription(sub);

    let newSubscriptions = isSubscribed
      ? state.subscriptions.filter(it => !toggledSubscription(it))
      : state.subscriptions.concat([sub]);

    newUserVideos({
      subscriptions: newSubscriptions,
      favorites: state.favorites,
      watched: state.watched
    })
      .then(() => {
        commit("changeSubscriptions", newSubscriptions);
      })
      .catch(error => {
        commit("notify/error", { error }, { root: true });
      });
  },
  toggleFavorite({ commit, state }, videoId) {
    let video = {
      videoId: videoId,
      timestamp: new Date().getTime()
    };

    let isFavorited = state.favorites.some(it => it.videoId == videoId);
    let newVideos = isFavorited
      ? state.favorites.filter(it => it.videoId != videoId)
      : state.favorites.concat([video]);

    newUserVideos({
      favorites: newVideos,
      watched: state.watched,
      subscriptions: state.subscriptions
    })
      .then(() => {
        commit("changeFavorites", newVideos);
      })
      .catch(error => {
        commit("notify/error", { error }, { root: true });
      });
  },
  toggleWatched({ commit, state }, videoId) {
    let video = {
      videoId: videoId,
      timestamp: new Date().getTime()
    };

    let isWatched = state.watched.some(it => it.videoId == videoId);
    let newVideos = isWatched
      ? state.watched.filter(it => it.videoId != videoId)
      : state.watched.concat([video]);

    newUserVideos({
      watched: newVideos,
      favorites: state.favorites,
      subscriptions: state.subscriptions
    })
      .then(() => {
        commit("changeWatched", newVideos);
      })
      .catch(error => {
        commit("notify/error", { error: error }, { root: true });
      });
  }
};

let getters = {
  hasSpeakerSubscription: state => speaker =>
    state.subscriptions.some(it => it.topic == speaker && it.type == "speaker"),
  hasSubscription: state => sub =>
    state.subscriptions.some(
      it => it.topic == sub.topic && it.type == sub.type
    ),
  hasSubscriptions: state => state.subscriptions.length > 0,
  isWatched: state => videoId =>
    state.watched.some(item => item.videoId == videoId),
  isFavorite: state => videoId =>
    state.favorites.some(item => item.videoId == videoId),

  watchedIds: state =>
    state.watched
      .map(video => video.videoId)
      .filter(video => video != undefined),
  favoriteIds: state =>
    state.favorites
      .map(video => video.videoId)
      .filter(video => video != undefined),

  watchedCount: (state, getters) => getters.watchedIds.length,
  favoriteCount: (state, getters) => getters.favoriteIds.length
};

let mutations = {
  init: (state, initial) => {
    if (initial) {
      state.watched = initial.watched;
      state.subscriptions = initial.subscriptions || [];
      state.favorites = initial.favorites || [];
    }
    state.loading = false;
  },
  noLoading: state => {
    state.loading = false;
  },
  changeWatched: (state, watched) => {
    state.watched = watched;
  },
  changeFavorites: (state, favorites) => {
    state.favorites = favorites;
  },
  changeSubscriptions: (state, subscriptions) => {
    state.subscriptions = subscriptions;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
