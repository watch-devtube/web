import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookie from 'vue-cookie'
import VueDisqus from 'vue-disqus'
import AsyncComputed from 'vue-async-computed'
import InstantSearch from 'vue-instantsearch'
import VueProgressBar from 'vue-progressbar'

import App from './App.vue'
import Watch from './Watch.vue'
import Search from './Search.vue'
import { flatten, views, duration, truncate, published } from './helpers/filters'

Vue.use(InstantSearch)
Vue.use(VueCookie)
Vue.use(VueRouter)
Vue.use(VueDisqus)
Vue.use(AsyncComputed)
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '2px'
})

Vue.filter('flatten', flatten)
Vue.filter('views', views)
Vue.filter('duration', duration)
Vue.filter('truncate', truncate)
Vue.filter('published', published)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { name: 'video', path: '/video/:id', component: Watch, props: true },
    { name: 'speaker', path: '/@:speaker', component: Search, props: true },
    { name: 'channel', path: '/channel/:channel', component: Search, props: true },
    { name: 'tag', path: '/tag/:tag', component: Search, props: true },
    { name: 'search', path: '/', component: Search, props: (route) => ({ showNew: route.query.showNew }) },
  ],
})

// eslint-disable-next-line no-new
new Vue({
  el: '#vue',
  render: h => h(App),
  router,
})
