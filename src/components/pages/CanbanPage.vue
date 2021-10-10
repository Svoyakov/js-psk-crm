<template>
    <div class="canban-wrap">

      <div class="canban component-root"
        v-show="getRouteData && getRouteData.name === 'canban'"
      >
        <Header />
        <Columns />
        <Footer />
      </div>

      <router-view></router-view>
    </div>
</template>

<script lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Columns from '@/components/pages/Columns.vue'
import m from '@/mixins/m'

interface Iobject {
  [key: string]: any
}

export default {
  name: 'Canban',
  mixins: [m],
  components: {
    Header,
    Footer,
    Columns,
  },
  data(): Iobject {
    return {}
  },
  computed: {

  },
  methods: {

  },
}
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/general.scss';

.canban-wrap {
  min-height: 100%;
  position: relative;
}
</style>
