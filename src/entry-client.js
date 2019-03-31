import "babel-polyfill"

import Vue from 'vue'
import Vuex from 'vuex'

import VueRouter from 'vue-router'
import VueCookie from 'vue-cookie'
import AsyncComputed from 'vue-async-computed'
import InstantSearch from 'vue-instantsearch'
import VueProgressBar from 'vue-progressbar'
import Notifications from 'vue-notification'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEllipsisV, faTimes, faCheck, faClock, faPaperPlane, faStar, faEnvelope, faCircle, faPlus, faMinus, faUser, faPlusCircle, faMinusCircle, faCheckCircle, faThumbsUp, faThumbsDown, faUserCircle, faLanguage, faEdit, faSortAlphaDown} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
library.add(faEllipsisV, faTimes, faCheck, faPaperPlane, faClock, faStar, faEnvelope, faCircle, faPlus, faMinus, faPlusCircle, faUser, faMinusCircle, faCheckCircle, faThumbsUp, faThumbsDown, faUserCircle, faLanguage, faEdit, faSortAlphaDown)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

import {firebase} from './helpers/firebase'

import App from './App.vue'
import Watch from './Watch.vue'
import Brownbag from './Brownbag.vue'
import Search from './Search.vue'
import Contributors from './Contributors.vue'
import { flatten, duration, kilo, noemoji, truncate, published, dateFmt, capitalizeIfNeeded, durationFull } from './helpers/filters'

import auth from './auth'
import videos from './videos'
import loading from './loading'
import notify from './notify'
import query from './query'
import likes from './likes'



Vue.use(Vuex)
Vue.use(InstantSearch)
Vue.use(VueCookie)
Vue.use(Notifications)
Vue.use(VueRouter)
Vue.use(AsyncComputed)
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '2px'
})

Vue.filter('dateFmt', dateFmt)
Vue.filter('flatten', flatten)
Vue.filter('duration', duration)
Vue.filter('durationFull', durationFull)
Vue.filter('truncate', truncate)
Vue.filter('published', published)
Vue.filter('kilo', kilo)
Vue.filter('noemoji', noemoji)
Vue.filter('capitalizeIfNeeded', capitalizeIfNeeded)

Vue.mixin({
  methods: {
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  }
})

const router = new VueRouter({
  mode: 'history',
  linkExactActiveClass: 'is-active',
  routes: [
    { name: 'contributors', path: '/contributors', component: Contributors },
    { name: 'brownbag', path: '/brownbags/:id', component: Brownbag, props: true },
    { name: 'video', path: '/video/:id', component: Watch, props: true },
    { name: 'speaker', path: '/@:speaker', component: Search, props: true },
    { name: 'channel', path: '/channel/:channel', component: Search, props: true },
    { name: 'tag', path: '/tag/:tag', component: Search, props: true },
    { name: 'search', path: '/', component: Search, 
      props: (route) => ({ 
        q: route.query.q, 
        showMyWatched: (route.query.w === 'true'),
        showMyFeed: (route.query.feed === 'true'),
        showFavorites: (route.query.f === 'true') })
    }
  ],
})

import createPersistedState from "vuex-persistedstate"
const store = new Vuex.Store({
  modules: {
    auth, videos, loading, notify, query, likes
  },
  strict: true,
  plugins:[
    createPersistedState({key: 'devtube', paths: ['auth', 'query']})
  ]
})

// eslint-disable-next-line no-new
new Vue({
  el: '#vue',
  store,
  render: h => h(App),
  router,
  created () {
    firebase.auth().onAuthStateChanged(user => {
      store.dispatch('auth/autoSignIn', user)
      store.dispatch('videos/initialize', user)
    })
  }  
})
