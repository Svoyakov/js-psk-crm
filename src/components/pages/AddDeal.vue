<template>
    <div class="add-deal-wrap component-root">
      <div class="add-deal">
        <Header />

        <div class="top">
          <span class="top__item">
            <h1>Добавить сделку</h1>
            <p>в разработке</p>
          </span>
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
  name: 'AddDeal',
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
