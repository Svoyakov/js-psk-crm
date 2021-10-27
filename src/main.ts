import Vue from 'vue'
import VueRouter from 'vue-router'
import VueTheMask from 'vue-the-mask'

import store from '@/store'
import App from '@/App.vue'
import routes from './routes/index'

Vue.use(VueRouter)
Vue.use(VueTheMask)

const NODE_ENV = 'development';

(function cons(ENV) {
  const logArr: string[] = ['log']
  logArr.forEach((type: string) => {
    if (type === 'log') {
      const l = console.log
      console.log = (...args: string[]) => {
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

Vue.config.productionTip = false

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
      id: 1,
      firstName: 'Иван',
      middleName: 'Иванович',
      lastName: 'Иванов',
      status: 0,
      active: 1,
    },
  },
})

store.dispatch('app/setDatetimeCorrect', {
  data: {
    datetime: 1632664341,
    data: 0,
  },
})
