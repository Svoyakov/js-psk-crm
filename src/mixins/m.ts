import { mapGetters } from 'vuex'

interface Iobject {
    [key: string]: any
}

export default {
  computed: {
    ...mapGetters('app', [
      'getCanbanData',
      'getCanbanOrder',
      'getCanbanDeal',
      'getRouteData',
      'getUser',
      'getLoader',
    ]),
  },
  methods: {
    routeGo(data: Iobject): void {
      this.$router.push(data)
    },
    noData(data: any, text: string): any {
      if (!data) return `<i>${text}</i>`
      return data
    },
    checkPhone(item: Iobject): string | boolean {
      try {
        return item.contacts[0].phones[0].phone
      } catch (err) {
        return false
      }
    },
  },
} as Iobject
