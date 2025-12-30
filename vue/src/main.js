import Vue from "vue";
import Vuex from "vuex";

import VueHead from "vue-head";
import VueRouter from "vue-router";
import Notifications from "vue-notification";
import VueObserveVisibility from "vue-observe-visibility";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faTwitter,
  faGithub,
  faGoogle,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import {
  faTimes,
  faCheck,
  faEnvelope,
  faPlus,
  faCircle,
  faHashtag,
  faSquareRss
} from "@fortawesome/free-solid-svg-icons";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { faCheckCircle as fasCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { faClock as fasClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import {
  faHeart,
  faEye,
  faEyeSlash,
  faStar,
  faCheckCircle,
  faClock,
  faEdit
} from "@fortawesome/free-regular-svg-icons";
library.add(
  faTimes,
  faCheck,
  faClock,
  faStar,
  faEnvelope,
  faPlus,
  faGithub,
  faCircle,
  faGoogle,
  faEdit,
  faEyeSlash,
  faHashtag,
  faHeart,
  faSquareRss,
  faTwitter,
  faLinkedin,
  faEye,
  faCheckCircle,
  fasHeart,
  fasCheckCircle,
  fasStar,
  fasClock,
  faClock
);

import VideoComment from "./VideoComment.vue";
Vue.component("VideoComment", VideoComment);
Vue.component("font-awesome-icon", FontAwesomeIcon);

import App from "./App.vue";
import Watch from "./Watch.vue";
import Search from "./Search.vue";
import { ago, published, year, durationFull } from "./helpers/filters";

import auth from "./auth";
import edit from "./edit";
import user from "./user";

Vue.use(VueHead, {
  separator: "",
  complement: ""
});
Vue.use(Vuex);
Vue.use(Notifications);
Vue.use(VueRouter);
Vue.use(VueObserveVisibility);

Vue.filter("durationFull", durationFull);
Vue.filter("published", published);
Vue.filter("year", year);
Vue.filter("ago", ago);
require("./styles/main.scss");

const router = new VueRouter({
  mode: "history",
  linkExactActiveClass: "is-active",
  routes: [
    { name: "video", path: "/video/:id", component: Watch, props: true },
    {
      name: "search",
      path: "/:query?",
      component: Search
    }
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

const store = new Vuex.Store({
  modules: {
    auth,
    edit,
    user
  },
  strict: true
});

import Plausible from "plausible-tracker";
const { enableAutoPageviews } = Plausible({
  domain: "dev.tube",
  apiHost: "https://a.dev.events"
});
enableAutoPageviews();

new Vue({
  el: "#app",
  store,
  router,
  render: h => h(App),
  async created() {
    store.dispatch("auth/bootstrap");
    store.dispatch("user/bootstrap");
  }
});
