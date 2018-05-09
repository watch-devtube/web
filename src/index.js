import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import AsyncComputed from 'vue-async-computed'
import InstantSearch from 'vue-instantsearch'
import App from './App.vue'
import Watch from './Watch.vue'
import Search from './Search.vue'
import dayjs from 'dayjs'

Vue.use(InstantSearch)
Vue.use(VueRouter)
Vue.use(Meta)
Vue.use(AsyncComputed)

Vue.filter('flatten', it => {
  if (!it) {
    return it
  }

  let flatten = arr => 
    arr.reduce((flat, toFlatten) => 
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);

  return flatten(it)
})

Vue.filter('views', it => {
   return it && it >= 1000 
   		?  
   			Math.round(it / 1000) + '.' + (it % 1000).toString().charAt(0) +  'K' 
   		: 
   			it
})

Vue.filter('duration', it => {
   if (!it) {
   		return it
   }

   let h = it >= 3600 ? Math.round(it / 3600) : 0
   let hs = h ? `${h} hour ` : ''
   let m = h ? Math.round(it % 3600 / 60) : Math.round(it / 60)
   let ms = m ? `${m} min` : ''
   return `${hs}${ms}`
})

Vue.filter('published', it => {
   return it
   		?  	
   			dayjs(it * 1000).format('YYYY MMM')
   		: 
   			it;
})

const router = new VueRouter({
  mode: 'history',
  routes: [
    { name: 'search', path: '/search', component: Search },
    { name: 'watch', path: '/video/:id', component: Watch, props: true },
    { path: '/', redirect: '/search' }
  ]
})

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
  router,
})
