<template>
  <div class="error-wrap">
    <div class="error component-root">
        <Header />
        <Error />
        <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Error from '@/components/atoms/Error.vue'

interface Iobject {
  [key: string]: any
}

export default {
  name: 'ErrorPage',
  components: {
    Header,
    Footer,
    Error,
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
