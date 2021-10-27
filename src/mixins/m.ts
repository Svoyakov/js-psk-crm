import { mapGetters } from 'vuex'
import { numberWithSpaces } from '@/utils'

interface Iobject {
    [key: string]: any
}

export default {
  data() {
    return {
      changeDealTimeout: null,
      changeDealTime: {
        keyup: 300,
        blur: 0,
      },
    }
  },
  computed: {
    ...mapGetters('app', [
      'getState',
      'getCanbanData',
      'getCanbanOrder',
      'getCanbanDeal',
      'getRouteData',
      'getUser',
      'getUsers',
      'getLoader',
      'getDatetimeCorrect',
      'getPopupDialog',
    ]),
  },
  methods: {
    getDisabled(mode: string, item: string): boolean {
      return false
    },
    getItemId(id: string): string {
      return id.replace(/\./g, '_')
    },
    routeGo(data: Iobject): void {
      this.$router.push(data)
    },
    noData(data: any, text: string, textSuccessAfter = ''): any {
      try {
        if (!data) return `<span class="no-data">${text}</span>`
        return `${data}${textSuccessAfter}`
      } catch (err) {
        return `${data}${textSuccessAfter}`
      }
    },
    checkPhone(item: Iobject): string | boolean {
      try {
        return item.contacts[0].phones[0].phone
      } catch (err) {
        return false
      }
    },
    numberWithSpaces(x: number): string {
      return numberWithSpaces(x)
    },
  },
} as Iobject
