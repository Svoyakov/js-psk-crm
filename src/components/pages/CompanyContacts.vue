<template>
    <div class="company-contacts-wrap">
      <div class="company-contacts component-root">
        <Header />

        <div class="top">
          <div class="top__item">
            <h1>Добавить компанию и/или контакты</h1>
          </div>
        </div>

        <AddEditCompanyContacts type="add" />
        <Footer />
      </div>
    </div>
</template>

<script lang="ts">
import m from '@/mixins/m'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import AddEditCompanyContacts from '@/components/pages/AddEditCompanyContacts.vue'

interface Iobject {
  [key: string]: any
}

export default {
  name: 'CompanyContacts',
  mixins: [m],
  components: {
    Header,
    Footer,
    AddEditCompanyContacts,
  },
  data(): Iobject {
    return {

    }
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
