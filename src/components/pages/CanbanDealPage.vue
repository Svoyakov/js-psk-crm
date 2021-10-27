<template>
    <div class="canban-deal-wrap">
      <div class="canban-deal component-root">
        <Header />
        <Error v-if="error === true" />

        <div class="deal-body" v-if="error === false && d">
          <div class="deal-body__left">

            <h1>
              <span v-html="noData(d['company.name'], 'нет названия компании')"></span>,
              <span v-html="noData(d['deal.city'], 'нет города')"></span>
            </h1>
            <p v-html="noData(d['deal.info'], 'нет дополнительного описания')"></p>
            <br />
            <h3>Характеристики</h3>
            <p class="khar">
              <span class="khar__name">Тип</span>:
              <span class="khar__prop" v-html="noData(d['deal.purpose'], 'нет данных')"></span>
            </p>
            <p class="khar">
              <span class="khar__name">Габариты</span>:
              <span class="khar__prop">
                <span v-html="noData(d['deal.size.l'], 'нет длины')"></span>
                x
                <span v-html="noData(d['deal.size.w'], 'нет ширины')"></span>
              </span>
            </p>
            <p class="khar">
              <span class="khar__name">Площадь по осям</span>:
              <span class="khar__prop"
                 v-html="noData(d['deal.size.l'] * d['deal.size.w'], 'нет данных', ' м<sup>2</sup>')"
              ></span>
            </p>
            <p class="khar">
              <span class="khar__name">Материал</span>:
              <span class="khar__prop" v-html="noData(d['deal.material'], 'не указан')"></span>
            </p>
            <p class="khar">
              <span class="khar__name">Полезная внутренная высота</span>:
              <span class="khar__prop" v-html="noData(d['deal.size.w'], 'не указана', ' м')"></span>
            </p>
            <br />
            <h4>
              <span v-html="noData(d['deal.region'], 'нет региона')"></span>
            </h4>
            <p class="khar">
              <span class="khar__name">-- Город доставки</span>:
              <span class="khar__prop" v-html="noData(d['deal.city'], 'нет города')"></span>
            </p>
            <p class="khar">
              <span class="khar__name">-- Снеговая нагрузка</span>:
              <span class="khar__prop">180 кг/м<sup>2</sup></span>
            </p>
            <p class="khar">
              <span class="khar__name">-- Ветровая нагрузка</span>:
              <span class="khar__prop">23 кг/м<sup>2</sup></span>
            </p>
            <br />
            <h3>
              Стоимость
              <span v-html="noData(numberWithSpaces(d['deal.price']), 'не указана', ' ₽')"></span>
            </h3>
            <p class="brown">с учетом НДС 20% и доставки</p>
            <br />
            <p class="khar">
              <span class="khar__name">-- Производство</span>:
              <span class="khar__prop"
                v-html="noData(numberWithSpaces(d['deal.priceParts.production']), 'не указана', ' ₽')"
              ></span>
            </p>
            <p class="khar">
              <span class="khar__name">-- Доставка</span>:
              <span class="khar__prop"
                v-html="noData(numberWithSpaces(d['deal.priceParts.delivery']), 'не указана', ' ₽')"
              ></span>
            </p>
            <p class="khar">
              <span class="khar__name">-- Монтаж</span>:
              <span class="khar__prop"
                v-html="noData(numberWithSpaces(d['deal.priceParts.installation']), 'не указана', ' ₽')"
              ></span>
            </p>
            <br />
            <h3>Контакты</h3>
            <p class="khar">
              <span class="khar__name">Компания</span>:
              <span class="khar__prop"
                v-html="noData(d['company.name'], 'нет названия компании')"
              ></span>
            </p>
            <p class="khar"  v-if="d.contacts[0]">
              <span class="khar__name">Контакты</span>:
              <span class="khar__prop">
                <span v-html="noData(d.contacts[0].firstName, 'имя не указано')">
                </span> <span v-html="noData(d.contacts[0].lastName, 'фамилия не указана')"></span>
              </span>
            </p>
            <p class="khar" v-if="d['company.contacts'] && d['company.contacts'][0]">
              <span class="khar__name">Телефон</span>:
              <span class="khar__prop" 
                v-if="d['company.contacts'][0].phones && d['company.contacts'][0].phones[0]"
                v-html="noData(d['company.contacts'][0].phones[0].phone, 'не указан')"
              ></span>
              <span class="khar__prop" v-else v-html="noData(false, 'не указан')"></span>
            </p>
            <p class="khar" v-if="d['company.contacts'] && d['company.contacts'][0]">
              <span class="khar__name">Email</span>:
              <span class="khar__prop" 
                v-if="d['company.contacts'][0].emails && d['company.contacts'][0].emails[0]"
                v-html="noData(d['company.contacts'][0].emails[0].email, 'не указан мыло')"
              ></span>
              <span class="khar__prop" v-else v-html="noData(false, 'не указан')"></span>
            </p>
            <p class="khar" v-if="d['company.contacts'] && d['company.contacts'][0]">
              <span class="khar__name">Site</span>:
              <span class="khar__prop" 
                v-if="d['company.contacts'][0].sites && d['company.contacts'][0].sites[0]"
                v-html="noData(d['company.contacts'][0].sites[0].site, 'не указан')"
              ></span>
              <span class="khar__prop" v-else v-html="noData(false, 'не указан')"></span>
            </p>
            <br />
            <p>
              <span class="a editButton" @click="routeGo({ name: 'editDeal' })">Редактировать</span>
            </p>
          </div>

          <div class="deal-body__right">
            <!-- {{ getCanbanDeal }} -->
          </div>
        </div>

        <Footer />
      </div>
    </div>
</template>

<script lang="ts">
import canbanRouteData from '@/conf/routes/pages/canban'
import m from '@/mixins/m'
import { cloneObj } from '@/utils'
import { getCanbanDeal } from '@/store/plugins/generalFunctions'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Error from '@/components/atoms/Error.vue'

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
    d() {
      return this.canbanDeal?.data
    },
  },
  methods: {
    initialCanbanDealPage(): void {
      if (this.$route.name !== canbanRouteData.children[0].name) return
      if (this.getUser === null) this.routeGo({ name: 'auth' })
      if (this.error !== null) this.error = null

      const id = Number(this.$route.params.id)
      this.$store.dispatch('app/setLoader', { data: true })
      getCanbanDeal(id).then((result: boolean) => {
        console.log('getCanbanDeal result refresh', result)
        this.canbanDeal = cloneObj(this.getCanbanDeal)
        this.error = false
      }).catch((error: Error) => {
        console.warn('error getCanbanDeal', error)
        this.error = true
      }).then(() => {
        this.$store.dispatch('app/setLoader', { data: false })
      })
    },
  },
} as Iobject
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/general.scss';

.deal-body {
  font-size: 0;
  display: flex;

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

  h1 {
    font-size: 25px;
    line-height: 29px;
  }

  p {
    font-size: 13px;
    line-height: 20px;

    .khar__prop {
      font-family: "roboto-bold";
    }
  }

  p.brown {
    color: $brown;
  }

  h3 {
    font-size: 15px;
    line-height: 21px;
    color: $brown;
    text-transform: uppercase;

    span {
      color: $font-color;
    }
  }

  .editButton {
    border-bottom: 1px dashed #999
  }
}
</style>
