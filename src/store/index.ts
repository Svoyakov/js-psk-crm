import Vue from 'vue'
import Vuex from 'vuex'
import appModule from './modules/app/index'
import appController from './controllers/app/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  modules: {
    app: appModule,
  },
  plugins: [
    appController(),
  ],
})

export default store
