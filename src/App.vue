<template>
  <div id="app">
    <router-view></router-view>
    <Load />
    <PopupDialog />
  </div>
</template>

<script lang="ts">
import routes from '@/routes/index'
import m from '@/mixins/m'
import Load from '@/components/Load.vue'
import PopupDialog from '@/components/pages/PopupDialog.vue'

interface Iobject {
  [key: string]: any
}

const getRouterItem = (r: Iobject, name: any): Iobject | boolean => {
  let result: Iobject | boolean = false
  for (let i = 0; i < routes.length; i += 1) {
    if (!r[i]) continue
    if (r[i].name === name) {
      result = r[i]
      break
    }
    if (r[i].children) result = getRouterItem(r[i].children, name)
  }
  return result
}

export default {
  name: 'app',
  mixins: [m],
  components: {
    Load,
    PopupDialog,
  },
  watch: {
    $route(to: Iobject, from: Iobject): void {
      setTimeout(() => {
        this.$store.dispatch('app/setRouteData', { data: getRouterItem(routes, to.name) })
      }, 0)
      console.log(from.name, '--', to.name)
    },
    getState(state: string): void {
      if (state === 'INITIAL') {
        this.$store.dispatch('app/setRouteData', {
          data: getRouterItem(routes, this.$route.name),
        })
      }
    },
    getRouteData(route: Iobject): void {
      console.log('route:', route)
      if (!route) this.routeGo({ name: 'error' })
    },
  },
  computed: {

  },
  methods: {

  },
} as Iobject
</script>

<style lang="scss">
@import './assets/css/fonts.css';
@import './assets/css/main.css';
@import './assets/css/variables.scss';

#app {
  min-width: $min-width-body;
  max-width: $max-width-body;
  margin: 0 auto;
  height: 100%;
  box-sizing: border-box;
  font-family: $font-regular, Arial;
}
</style>
