import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import App from '@/App.vue'
import storeSettings from './store/index'
import routes from './routes/index'

const NODE_ENV = 'development';

(function cons(ENV) {
  const logArr: string[] = ['log', 'warn', 'error']
  logArr.forEach((type: string) => {
    if (type === 'log') {
      const l = console.log
      console.log = (...args: string[]) => {
        if (ENV === 'development') l.apply(console, args)
      }
    }
    if (type === 'warn') {
      const l = console.warn
      console.warn = (...args: string[]) => {
        if (ENV === 'development') l.apply(console, args)
      }
    }
    if (type === 'error') {
      const l = console.error
      console.error = (...args: string[]) => {
        if (ENV === 'development') l.apply(console, args)
      }
    }
  })
}(NODE_ENV))

console.log(routes)

const router = new VueRouter({
  mode: 'history',
  routes,
})

declare const window: Window & typeof globalThis & {vm: any}

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.config.productionTip = false

const store: any = new Vuex.Store(storeSettings())

window.vm = new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')

store.dispatch('app/setState', { data: 'INITIAL' })

/// ////////////// для тестов

store.dispatch('app/setUser', {
  data: {
    datetime: 1632664341,
    data: {
      id: 12,
      firstName: 'Алексей',
      middleName: 'Викторович',
      lastName: 'Алексеев',
      status: 0,
      active: 1,
    },
  },
})
