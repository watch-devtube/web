import Vue from 'vue';
import VueRouter from 'vue-router';
import InstantSearch from 'vue-instantsearch';
import App from './App.vue';
import Watch from './Watch.vue';
import Search from './Search.vue';

Vue.use(InstantSearch);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { name: 'search', path: '/search', component: Search},
    { name: 'watch', path: '/video/:id', component: Watch, props: true },
    { path: '/', redirect: '/search' }
  ]
});

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
  router,
});
