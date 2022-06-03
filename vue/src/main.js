import Vue from "vue";
import Vuex from "vuex";

import VueHead from "vue-head";
import VueRouter from "vue-router";
import Notifications from "vue-notification";
import VueObserveVisibility from "vue-observe-visibility";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from "@fortawesome/vue-fontawesome";

import {
  faYoutube,
  faTwitter,
  faGithub,
  faGoogle,
  faFacebookSquare,
  faTwitterSquare,
  faLinkedin,
  faProductHunt
} from "@fortawesome/free-brands-svg-icons";
import {
  faEllipsisV,
  faTimes,
  faCheck,
  faPaperPlane,
  faEnvelope,
  faPlus,
  faMinus,
  faUser,
  faPlusCircle,
  faMinusCircle,
  faSortAlphaDown,
  faCircle,
  faHashtag,
  faSearch,
  faSquareRss
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown as fasThumbsDown } from "@fortawesome/free-solid-svg-icons/faThumbsDown";
import { faThumbsUp as fasThumbsUp } from "@fortawesome/free-solid-svg-icons/faThumbsUp";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { faCheckCircle as fasCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { faClock as fasClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import {
  faHeart,
  faUserCircle,
  faEye,
  faEyeSlash,
  faStar,
  faThumbsUp,
  faThumbsDown,
  faBookmark,
  faGrinStars,
  faCheckCircle,
  faClock,
  faEdit,
  faCalendarPlus
} from "@fortawesome/free-regular-svg-icons";
library.add(
  faEllipsisV,
  faBookmark,
  faTimes,
  faCheck,
  faPaperPlane,
  faClock,
  faStar,
  faEnvelope,
  faProductHunt,
  faPlus,
  faMinus,
  faPlusCircle,
  faGithub,
  faUser,
  faCircle,
  faMinusCircle,
  faThumbsUp,
  faThumbsDown,
  faUserCircle,
  faGoogle,
  faEdit,
  faEyeSlash,
  faSortAlphaDown,
  faHashtag,
  faHeart,
  faSquareRss,
  faYoutube,
  faTwitter,
  faFacebookSquare,
  faTwitterSquare,
  faLinkedin,
  faEye,
  fasThumbsDown,
  fasThumbsUp,
  faGrinStars,
  faSearch,
  faCheckCircle,
  fasHeart,
  fasCheckCircle,
  fasStar,
  fasClock,
  faClock,
  faCalendarPlus
);

import VideoComment from "./VideoComment.vue";
Vue.component("VideoComment", VideoComment);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-layers", FontAwesomeLayers);
Vue.component("font-awesome-layers-text", FontAwesomeLayersText);

import App from "./App.vue";
import Watch from "./Watch.vue";
import Search from "./Search.vue";
import { ago, published, year, durationFull } from "./helpers/filters";

import auth from "./auth";
import edit from "./edit";
import user from "./user";

Vue.use(VueHead, {
  separator: "-",
  complement: "on DevTube"
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
