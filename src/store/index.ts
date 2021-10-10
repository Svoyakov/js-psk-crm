import appModule from './modules/app/index'
import appController from './controllers/app/index'

interface Iobject {
  [key: string]: any
}

export default (): Iobject => ({
  strict: true,
  modules: {
    app: appModule,
  },
  plugins: [
    appController(),
  ],
})
