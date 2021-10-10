<template>
  <div class="main-wrap">
    <div class="main component-root">
      <Header />

      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

interface Iobject {
  [key: string]: any
}

export default {
  name: 'Main',
  components: {
    Header,
    Footer,
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
</style>
