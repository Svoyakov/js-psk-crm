import { mapGetters } from 'vuex'
import { numberWithSpaces } from '@/utils'
import { validItem } from '@/conf/deals/validation'

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
    validation(d: Iobject, valid: Iobject, allInvalid: boolean): void {
      Object.keys(d).forEach((key: string) => {
        if (Array.isArray(d[key])) {
          d[key].forEach((a: Iobject) => {
            this.validation(a, valid, allInvalid)
          })
        } else {
          const r = this.scheme[key] ? d[key] : true
          d[key] = validItem(d, this.scheme, key, allInvalid)
          if (d[key] === true || (r === null && allInvalid === false)) {
            if (valid.status !== false) valid.status = false
          }
        }
      })
    },
    getDisabled(mode: string, item: string): boolean {
      if (mode || item) return false
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
