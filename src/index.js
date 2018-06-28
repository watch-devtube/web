import Vue from 'vue'
import VueRouter from 'vue-router'
import VueDisqus from 'vue-disqus'
import AsyncComputed from 'vue-async-computed'
import InstantSearch from 'vue-instantsearch'
import App from './App.vue'
import Watch from './Watch.vue'
import Search from './Search.vue'
import dayjs from 'dayjs'

Vue.use(InstantSearch)
Vue.use(VueRouter)
Vue.use(VueDisqus)
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
        (it < 100000 ? Math.round(it / 1000) + '.' + (it % 1000).toString().charAt(0) : Math.round(it / 1000))
        +  'K' 
   		: 
   			it
})

Vue.filter('duration', it => {
   if (!it) {
   		return it
   }

   let h = it >= 3600 ? Math.floor(it / 3600) : 0
   let hs = h ? `${h} h ` : ''
   let m = h ? Math.floor(it % 3600 / 60) : Math.round(it / 60)
   let ms = m ? `${m} min` : ''
   return `${hs}${ms}`
})

Vue.filter('truncate', (it, max) => {
   return it
      ?   
        it.slice(0, max) + (max < it.length ? '...' : '')
      : 
        it;
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
    // { name: 'search', path: '/search', component: Search },
    { name: 'video', path: '/video/:id', component: Watch, props: true },
    { name: 'speaker', path: '/@:id', component: Search, props: true },
    { name: 'search', path: '/', component: Search }
  ]
})

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
  router,
})
