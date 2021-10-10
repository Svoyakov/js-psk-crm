<template>
    <div class="canban-deal-wrap">
      <div class="canban-deal component-root">
        <Header />
        <Error v-if="error === true" />

        <div class="deal-body" v-if="error === false">
          <div class="deal-body__left">
            test
          </div>
          <div class="deal-body__right">
            {{ getCanbanDeal }}
          </div>
        </div>

        <Footer />
      </div>
    </div>
</template>

<script lang="ts">
import canbanRouteData from '@/conf/routes/pages/canban'
import { reloadDatetimeInterval } from '@/conf/canbanData'
import { tables } from '@/conf/tables'
import m from '@/mixins/m'
import CrmApi from '@/services/crmApi'
import { getUnFlat } from '@/store/plugins/canban/functions'
import { cloneObj } from '@/utils'

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Error from '@/components/atoms/Error.vue'

const crmApi = new CrmApi()

interface Iobject {
  [key: string]: any
}

export default {
  name: 'CanbanDeal',
  mixins: [m],
  components: {
    Header,
    Footer,
    Error,
  },
  data(): Iobject {
    return {
      error: false,
      canbanDeal: null,
    }
  },
  watch: {
    getRouteData(): void {
      this.initialCanbanDealPage()
    },
  },
  computed: {

  },
  methods: {
    initialCanbanDealPage(): void {
      if (this.$route.name !== canbanRouteData.children[0].name) return
      if (this.getUser === null) this.routeGo({ name: 'auth' })
      if (this.error !== null) this.error = null

      const datetime = Math.round(new Date().getTime() / 1000)
      const lastCanbanDealTime = this.getCanbanDeal?.datetime ?? 0
      const lastCanbanDealId = this.getCanbanDeal?.data?.id ?? 0
      const id = Number(this.$route.params.id)

      if (datetime - lastCanbanDealTime < reloadDatetimeInterval && lastCanbanDealId === id) {
        this.cloneCanbanDeal()
        return
      }

      this.$store.dispatch('app/setLoader', { data: true })
      const getDealData = {
        datetime,
        callbacks: [{ table: tables.canbanData, nameId: 'id', id }],
      }
      crmApi.sendAndGetData(getDealData).then((result: Iobject) => {
        console.log('result', result)
        const resultData = result.data[0][tables.canbanData]
        console.log('resultData', resultData)
        if (resultData.length === 0) {
          this.errorStatus()
          return
        }

        this.$store.dispatch('app/setCanbanDeal', {
          data: {
            datetime: Math.round(new Date().getTime() / 1000),
            data: getUnFlat(resultData)[0],
          },
        })
        this.cloneCanbanDeal()
      }).catch((error: Iobject) => {
        console.warn('error crmApi.sendAndGetData', error)
        this.errorStatus()
      })
    },
    cloneCanbanDeal(): void {
      this.error = false
      this.canbanDeal = cloneObj(this.getCanbanDeal)
      this.$store.dispatch('app/setLoader', { data: false })
    },
    errorStatus(): void {
      this.error = true
      this.$store.dispatch('app/setLoader', { data: false })
    },
  },
} as Iobject
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/general.scss';

.deal-body {
  font-size: 0;
  display: block;

  &__left,
  &__right {
    vertical-align: top;
    display: inline-block;
    width: 32%;
    font-size: 15px;
    background: #f5f5f5;
    padding: 30px 20px;
    box-sizing: border-box;
  }

  &__right {
    width: 68%;
    background: #fff;
  }
}
</style>
