<template>
    <div class="auth-wrap component-root">
      <div class="auth">
        <Header />

        <div class="top">
          <div class="top__item">
            <h1>Авторизация</h1>
            <p>в разработке</p>
          </div>
        </div>

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
  name: 'Auth',
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
} as Iobject
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/general.scss';
</style>
