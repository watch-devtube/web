let state = {
  subscriptions: [],
  loading: true,
  watched: [],
  favorites: []
};

let actions = {};

let getters = {
  hasSpeakerSubscription: state => speaker =>
    state.subscriptions.some(
      it => it.topic === speaker && it.type === "speaker"
    ),
  hasChannelSubscription: state => speaker =>
    state.subscriptions.some(
      it => it.topic === speaker && it.type === "channel"
    ),
  hasSubscription: state => sub =>
    state.subscriptions.some(
      it => it.topic == sub.topic && it.type == sub.type
    ),
  hasSubscriptions: state => state.subscriptions.length > 0,
  isWatched: state => videoId =>
    state.watched.some(item => item.videoId == videoId),
  isFavorite: state => videoId =>
    state.favorites.some(item => item.videoId == videoId),

  watchedIds: state => state.watched.map(({ videoId }) => videoId),
  favoriteIds: state => state.favorites.map(({ videoId }) => videoId),
  channelSubscriptions: state =>
    state.subscriptions
      .filter(sub => sub.type == "channel")
      .map(sub => sub.topic),
  speakerSubscriptions: state =>
    state.subscriptions
      .filter(sub => sub.type == "speaker")
      .map(sub => sub.topic)
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
