import Vue from 'vue'
import VueRouter from 'vue-router'
import AsyncComputed from 'vue-async-computed'
import InstantSearch from 'vue-instantsearch'

import App from './App.vue'
import Watch from './Watch.vue'
import Search from './Search.vue'
import { flatten, views, duration, truncate, published } from './helpers/filters'

Vue.use(InstantSearch)
Vue.use(VueRouter)
Vue.use(AsyncComputed)

Vue.filter('flatten', flatten)
Vue.filter('views', views)
Vue.filter('duration', duration)
Vue.filter('truncate', truncate)
Vue.filter('published', published)

const router = new VueRouter({
  mode: 'history',
  routes: [
    // { name: 'search', path: '/search', component: Search },
    { name: 'video', path: '/video/:id', component: Watch, props: true },
    { name: 'speaker', path: '/@:id', component: Search, props: true },
    { name: 'search', path: '/', component: Search },
  ],
})

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
  router,
})
