<template>
    <div class="add-deal-wrap">
      <div class="add-deal component-root">
        <Header />

        <div class="top">
          <div class="top__item">
            <h1 v-if="mode === 'add'">Добавить сделку</h1>
            <h1 v-if="mode === 'edit'">Редактировать сделку</h1>
            <p v-show="error === true">При загрузке произошла ошибка</p>
          </div>
        </div>

        <div class="scheme-wrap" v-show="error === false && mode !== null">
          <div class="scheme" v-if="defaultDeal !== null || scheme !== null">
            <div v-for="(item, i) in Object.keys(defaultDeal)" :key="item + i">

              <div v-if="scheme[item] && !addingInit[item]" class="scheme-item">
                <span class="scheme-item__name" 
                  v-html="`${scheme[item].name}${scheme[item].units ? ', ' + scheme[item].units : ''}`"
                ></span>

                <CustomInput class="scheme-item__input"
                  v-if="scheme[item].list === null"
                  :parent="defaultDeal"
                  :item="item"
                  :disabled="getDisabled(mode, item)"
                  :type="scheme[item].type"
                  :novalid="validOb[item]"
                  @keyup="changeDealData(defaultDeal, validOb, item, item, 'keyup')"
                  @blur="changeDealData(defaultDeal, validOb, item, item)"
                />
                <CustomSelect v-if="scheme[item].list !== null"
                  class="scheme-item__select"
                  :disabled="getDisabled(mode, item)"
                  :id="getItemId(item)"
                  :itemParent="defaultDeal"
                  :itemName="item"
                  :options="scheme[item].list"
                  :scheme="scheme"
                  :data-novalid="validOb[item]"
                  :validOb="validOb"
                  :root="item"
                  @changeDealData="changeDealData"
                />
              </div>

              <div v-if="scheme[item] && addingInit[item]" class="scheme-item">
                <span class="scheme-item__name" v-html="scheme[item].name"></span>
                <Draggable class="scheme-item__drag"
                  :disabled="getDisabled(mode, item)"
                  :mode="mode"
                  :itemParent="defaultDeal"
                  :itemName="item"
                  :scheme="scheme"
                  :validOb="validOb[item]"
                  :root="item"
                  @changeDealData="changeDealData"
                />
              </div>

            </div>
          </div>

          <br />
          <div class="buttons">
            <button class="buttons__button"
              :data-disabled="!valid.status"
              v-text="saveButton.text"
              @click="clickSaveDeal(defaultDeal, validOb)"
            />
          </div>
          <br /><br /><br /><br />
        </div>

        <Footer />
      </div>
    </div>
</template>

<script lang="ts">
import {
  topics, canbanDataScheme, addingInit, 
} from '@/conf/deals/dealsData'
import { defaultDeal, dealItemNames } from '@/conf/deals/defaultDeal'
import routerAddEditDeal from '@/conf/routes/pages/addEditDeal'
import { cloneObj, getNowSecods } from '@/utils'
import { validItem } from '@/conf/deals/validation'
import { getUsers, openPopupDialog, getCanbanDeal } from '@/store/plugins/generalFunctions'
import { tables } from '@/conf/tables'
import { getHistoryReqToTable, getUnFlat } from '@/store/plugins/canban/functions'

import CrmApi from '@/services/crmApi'
import m from '@/mixins/m'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Draggable from '@/components/atoms/Draggable.vue'
import CustomSelect from '@/components/atoms/CustomSelect.vue'
import CustomInput from '@/components/atoms/CustomInput.vue'

const crmApi = new CrmApi()

interface Iobject {
  [key: string]: any
}

export default {
  name: 'AddEditDeal',
  mixins: [m],
  components: {
    Header,
    Footer,
    Draggable,
    CustomSelect,
    CustomInput,
  },
  data(): Iobject {
    return {
      error: null,
      defaultDeal: cloneObj(defaultDeal),
      scheme: cloneObj(canbanDataScheme),
      addingInit,
      inputTimeout: null,
      inputTimer: {
        keyup: 500,
        blur: 0,
      },
      valid: { status: false },
      allInvalid: false,
      mode: null,
      changes: [],
      dealId: null,
      saveButton: {
        text: '',
        default: 'Сохранить',
        error: 'Некорректные данные',
        nochanges: 'Нет изменений',
        timeout: null,
        timer: 3000,
      },
    }
  },
  mounted(): void {
    this.dealId = null
    this.saveButton.text = this.saveButton.default
    this.changes = []
    this.mode = null
    this.error = null
    this.allInvalid = false
  },
  watch: {
    getRouteData(): void {
      if (this.getUser === null) this.routeGo({ name: 'auth' })
      if (this.$route.name === routerAddEditDeal[0].name) {
        this.mode = 'add'
        this.initialAddDeal()
      }
      if (this.$route.name === routerAddEditDeal[1].name) {
        this.mode = 'edit'
        this.initialEditDeal()
      }
    },
  },
  computed: {
    validOb(): Iobject {
      if (!this.defaultDeal.catId) return {}
      this.valid.status = true
      const d: Iobject = cloneObj(this.defaultDeal)
      this.validation(d, this.valid, this.allInvalid)
      return d
    },
    topics(): Iobject {
      return topics
    },
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
    saveError(alert: Iobject): void {
      if (this.saveButton.timeout) clearTimeout(this.saveButton.timeout)
      this.saveButton.text = alert
      this.saveButton.timeout = setTimeout(() => {
        this.saveButton.text = this.saveButton.default
      }, this.saveButton.timer)
    },
    clickSaveDeal(deal: Iobject, validOb: Iobject): void {
      console.log('clickSaveDeal', this.defaultDeal)
      if (this.valid.status === false) {
        if (this.allInvalid === false) this.allInvalid = true
        this.changeDealData(deal, validOb)
        this.saveError(this.saveButton.error)
      } else {
        if (this.mode === 'add') this.addDeal()
        if (this.mode === 'edit') {
          if (this.changes.length > 0) {
            this.editDeal()
          } else {
            this.saveError(this.saveButton.nochanges)
          }
        }
      }
    },
    async editDeal(): Promise<void> {
      console.log('changes', this.changes)
      this.$store.dispatch('app/setLoader', { data: true })
      const change: Iobject[] = []
      const history: Iobject = []
      this.changes.forEach((key: string) => {
        if (dealItemNames[key]) history.push(dealItemNames[key])
        let d = this.defaultDeal[key]
        d = Array.isArray(d) ? JSON.stringify(d).replace(/null/g, '""') : d
        change.push({ 
          name: key,
          value: d === null ? '' : d, 
        })
      })
      const historyPush = getHistoryReqToTable({
        text: `Изменения ${history.join(', ')}`,
        dealId: this.dealId,
        userId: this.getUser.data.id,
      })
      const changeRequest: Iobject = {
        actions: [
          {
            table: tables.canbanData,
            id: this.dealId,
            nameId: 'id',
            type: 'change',
            items: change,
          },
        ],
        callbacks: [
          { 
            table: tables.canbanData,
            nameId: 'id',
            id: this.dealId,
            compare: '=',
          },
        ],
        datetime: getNowSecods(),
      }
      changeRequest.actions.push(historyPush)
      console.log('save', changeRequest)
      crmApi.sendAndGetData(changeRequest)
        .then((result: Iobject) => {
          console.log('changeRequest result', result)
          this.$store.dispatch('app/setCanbanDeal', {
            data: {
              datetime: getNowSecods(),
              data: getUnFlat(result.data[0][tables.canbanData])[0],
            },
          })
          const answers = [
            { name: 'Продолжить редактирование', result: false },
            { name: 'Перейти к сделке', result: true },
          ]
          openPopupDialog('Данные сохранены', answers)
            .then((answer: boolean) => {
              if (answer === true) this.routeGo({ name: 'canbanDeal', params: { id: this.dealId } })
              this.changes = []
            })
        })
        .catch((error: Iobject) => {
          console.warn('error changeRequest', error)
        }).then(() => {
          this.$store.dispatch('app/setLoader', { data: false })
        })
    },
    async addDeal(): Promise<void> {
      console.log('clickSaveDeal', this.defaultDeal)
      this.$store.dispatch('app/setLoader', { data: true })
      const insert: Iobject[] = []
      Object.keys(this.defaultDeal).forEach((key: string) => {
        let d = this.defaultDeal[key]
        d = Array.isArray(d) ? JSON.stringify(d).replace(/null/g, '""') : d
        insert.push({ 
          name: key,
          value: d === null ? '' : d, 
        })
      })
      const insertRequest: Iobject = {
        actions: [
          {
            table: tables.canbanData,
            type: 'insert',
            items: insert,
          },
        ],
        datetime: getNowSecods(),
      }
      console.log('insert request', insertRequest)
      crmApi.sendAndGetData(insertRequest)
        .then((result: Iobject) => {
          console.log('insert result', result)
          try {
            const id = result.inserted[0][tables.canbanData]
            this.routeGo({ name: 'canbanDeal', params: { id } })
          } catch (err: any) {
            throw new Error(err)
          }
        })
        .catch((error: Error) => {
          console.warn('error insertCanbanDeal', JSON.stringify(error))
          const answers = [{ name: 'Ok', result: true }]
          openPopupDialog('Ошибка при сохранении сделки', answers)
        })
        .then(() => {
          this.$store.dispatch('app/setLoader', { data: false })
        })
    },
    changeDealData(deal: Iobject, validOb: Iobject, item: string | null = null, root: string, e = 'blur'): void {
      if (root !== undefined && this.changes.includes(root) === false) this.changes.push(root)
      if (this.inputTimeout) clearTimeout(this.inputTimeout)
      this.inputTimeout = setTimeout(() => {     
        if (!item) return
        if (this.scheme[item] && this.scheme[item].type === 'text') {
          if (e === 'blur' && deal[item] === null) deal[item] = ''
        }
        if (this.scheme[item] && this.scheme[item].type === 'tel') {
          if (e === 'blur' && validOb[item] === false) {
            if (deal[item] !== null) deal[item] = Number(deal[item])
            if (deal[item] === null) deal[item] = ''
          }
        }
      }, this.inputTimer[e])
    },
    initialEditDeal(): void {
      this.dealId = Number(this.$route.params.id)
      this.$store.dispatch('app/setLoader', { data: true })
      getUsers()
        .then((result: boolean) => {
          console.log('getUsers result refresh', result)
          this.getUsers.data.forEach((user: Iobject) => {
            this.scheme['responsible.id'].list.push({
              name: `${user.firstName} ${user.lastName}`.trim(), 
              value: user.id,
            })
          })
          return getCanbanDeal(this.dealId)
        })
        .then((result: boolean) => {
          console.log('getCanbanDeal result refresh', result)
          Object.keys(this.getCanbanDeal.data).forEach((key: string) => {
            if (defaultDeal[key] !== undefined) {
              this.defaultDeal[key] = cloneObj(this.getCanbanDeal.data[key])
            }
          })
          this.error = false
        })
        .catch((error: Error) => {
          console.warn('error initialEditDeal', JSON.stringify(error))
          this.error = true
        })
        .then(() => {
          this.$store.dispatch('app/setLoader', { data: false })
        })
    },
    initialAddDeal(): void {
      this.$store.dispatch('app/setLoader', { data: true })
      getUsers()
        .then((result: boolean) => {
          console.log('getUsers result refresh', result)
          this.defaultDeal = cloneObj(defaultDeal)
          this.defaultDeal.author = this.getUser.data.id
          this.getUsers.data.forEach((user: Iobject) => {
            this.scheme['responsible.id'].list.push({
              name: `${user.firstName} ${user.lastName}`.trim(), 
              value: user.id,
            })
          })
          this.error = false
        }).catch((error: Error) => {
          console.warn('error initialAddDeal', JSON.stringify(error))
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

.add-deal-wrap {
  position: relative;
}

.scheme {

  &-item {
    padding: 5px;

    &__name {
      display: inline-block;
      vertical-align: top;
      min-width: 250px;
      text-align: right;
      padding: 3px 5px;
    }

    &__input {
      width: 350px;
      display: inline-block;
    }

    &__select {
      width: 350px;
      display: inline-block;
      outline: 0;
    }

    &__drag {
      width: 350px;
      display: inline-block;
    }

    &__select[data-novalid] .select__input-result,
    .items__input[data-novalid]  {
      background: rgb(255, 233, 233);
    }

    &__input[readonly] {
      cursor: pointer;
    }

  }
}

.list-group-item {

  .scheme-item__select {
    width: auto;
  }
}

.buttons {
  padding-left: 250px;
}

</style>
