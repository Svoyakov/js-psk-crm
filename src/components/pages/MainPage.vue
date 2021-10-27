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
    return {
      enabledDrag: { status: true },
      addDragItems: [
        'contacts',
        'phones',
        'emails',
        'company.contacts',
        'deal.additions.windows',
        'deal.additions.doors',
        'deal.additions.gates',
        'deal.additions.cranes',
      ],
      contacts: [
        {
          name: 'Джери',
          ord: 0,
          info: '',
          phones: [],
          emails: [],
        },
        {
          name: 'Иван',
          ord: 1,
          info: '',
          phones: [
            { phone: '+79998887766', info: '', ord: 0 },
          ],
          emails: [],
        },
        {
          name: 'Сергей',
          ord: 2,
          info: '',
          phones: [
            { phone: '+79994443322', info: '', ord: 0 },
            { phone: '+79993332211', info: '', ord: 1 },
          ],
          emails: [],
        },
        {
          name: 'Антон',
          ord: 2,
          info: '',
          phones: [],
          emails: [],
        },
      ],
    }
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
