<template>
  <div class="add-company-contacts" v-if="board">
    <div class="item" v-for="(b, ind) in getObjectKeys(board)" :key="b + ind">

      <div class="item__half left">
          <span class="item__title" v-text="board[b].name"></span>
      </div>

      <div class="item__half right">
        <div class="item__board" v-for="(d, i) in board[b].data" :key="d + i">
          <span class="item__del" @click="removeItem(d, i, board[b].data, b)">
              &#10006;
          </span>

          <div class="right__item"
            v-show="getVisible(b, i, m)"
            v-for="(m, j) in getObjectKeys(d)" :key="m + j"
          >
            <CustomTextarea class="right__item-data block"
              v-if="getFieldType(d, m) === 'textarea'"
              :parent="d"
              :item="m"
              :placeholder="phrases[m]"
            />

            <CustomInput class="right__item-data"
              v-if="getFieldType(d, m) === 'input'"
              :parent="d"
              :item="m"
              :placeholder="phrases[m]"
              :novalid="getValidItem(b, i, m)"
            />

            <CustomSelect class="right__item-data"
              v-if="getFieldType(d, m) === 'select'"
              :id="`company-${i}-${j}`"
              :itemParent="d"
              :itemName="m"
              :options="selectCompanies"
              :placeholder="phrases[m]"
              :scheme="{}"
              :root="m"
            />

            <Draggable class="right__item-data"
              v-if="getFieldType(d, m) === 'array'"
              :mode="null"
              :itemParent="d"
              :itemName="m"
              :scheme="{}"
              :root="m"
              :disabled="false"
            />

          </div>
          <p class="--options">
            <span  class="--options-button"
              v-text="getVisiblestatus(b, i) ? 'скрыть опции' : 'еще опции'"
              @click="setVisiblestatus(b, i)"
            ></span>
          </p>
        </div>
        <button v-if="!board[b].maxNum || board[b].data.length < board[b].maxNum"
          @click="addItem(board[b].data, b)"
          v-text="board[b].addButton"
        ></button>
      </div>
    </div>

    <div class="item">
        <div class="item__half left">
            <button :disabled="!valid" @click="saveData()">Сохранить</button>
        </div>
    </div>
  </div>
</template>

<script lang="ts">

import CrmApi from '@/services/crmApi'
import { cloneObj } from '@/utils'
import { tables } from '@/conf/tables'
import { defaultCompanyContacts } from '@/conf/company/defaultCompanyContacts'
import { 
  addingInit,
  board,
  companyContactsPhrases,
} from '@/conf/company/companyData'
import m from '@/mixins/m'
import { openPopupDialog, getInsertRequest } from '@/store/plugins/generalFunctions'
import Draggable from '@/components/atoms/Draggable.vue'
import CustomSelect from '@/components/atoms/CustomSelect.vue'
import CustomInput from '@/components/atoms/CustomInput.vue'
import CustomTextarea from '@/components/atoms/CustomTextarea.vue'

interface Iobject {
  [key: string]: any
}

const crmApi = new CrmApi()

export default {
  name: 'AddEditCompanyContacts',
  mixins: [m],
  components: {
    Draggable,
    CustomSelect,
    CustomInput,
    CustomTextarea,
  },
  props: {
    type: {
      required: true,
    },
    popup: {
      default: true,
    },
  },
  data() {
    return {
      enabledDrag: { status: true },
      addDragItems: ['phones', 'emails', 'sites', 'messengers'],
      reqiuredFields: {
        companyName: { minLength: 3 },
        firstName: { minLength: 2 },
      },
      dataFields: { company: [], contacts: [] },
      allVisibleStatus: { company: [], contacts: [] },
      fullVisibleItems: ['companyName', 'firstName', 'company'],
      inv: ['id'],
      board,
      addingInit,
      defaultCompanyContacts: cloneObj(defaultCompanyContacts),
      phrases: companyContactsPhrases,
      textarea: ['info'],
      companies: [],
      changes: [],
    }
  },
  mounted() {
    this.board = null
    this.init()
    this.companies = [ // Получить компании из базы
      { id: 1, name: 'Первая компания' },
      { id: 2, name: 'Вторая компания' },
    ]
    this.changes = []
  },
  watch: {
    popup(val: boolean) {
      if (val === false) this.init()
    },
  },
  computed: {
    selectCompanies(): Iobject {
      const s: Iobject[] = []
      let value: any = null
      s.push({ value: null, name: '<i>нет компании</i>' })
      if (this.board.company?.data.length > 0) {
        const c = this.board.company.data[0]
        value = c.id
        const name = `${c.companyType || ''} ${c.companyName || ''}`.trim() || 'нет имени компании'
        s.push({ value, name })
      }
      this.companies.forEach((c: Iobject) => {
        if (c.id !== value) {
          s.push({ value: c.id, name: c.name })
        }
      })
      return s
    },
    valid(): boolean {
      if (!this.board) return false
      let valid = true
      let isItems = false
      this.dataFields = { company: [], contacts: [] }
      this.getObjectKeys(this.board).forEach((b: string) => {
        this.board[b].data.forEach((item: any, ind: number) => {
          this.dataFields[b][ind] = {}
          if (!this.allVisibleStatus[b][ind]) {
            this.$set(this.allVisibleStatus[b], ind, { type: false })
          }
          this.getObjectKeys(item).forEach((i: string) => {
            if (isItems === false) isItems = true
            const len = item[i] ? item[i].length : 0
            if (this.reqiuredFields[i] && len < this.reqiuredFields[i].minLength) {
              valid = false
              this.dataFields[b][ind][i] = false
            }
          })
        })
      })
      if (isItems === false) return isItems
      return valid
    },
  },
  methods: {
    init(): void {
      if (this.type.startsWith('add') === true) {
        const companyData = cloneObj(this.defaultCompanyContacts.company)
        const contactsData = cloneObj(this.defaultCompanyContacts.contacts)
        this.board = {
          company: {
            data: companyData, name: 'Компания', addButton: 'Добавить компанию', maxNum: 1, 
          },
          contacts: { data: contactsData, name: 'Контакты', addButton: 'Добавить контакт' },
        }
      }
      this.allVisibleStatus = { company: [], contacts: [] }
      this.fullVisibleItems = ['companyName', 'firstName', 'company']
    },
    getVisible(b: string, i: number, g: string): boolean {
      if (this.allVisibleStatus[b][i]) {
        if (this.allVisibleStatus[b][i].type === false && !this.fullVisibleItems.includes(g)) {
          return false
        } 
      }
      return true
    },
    setVisiblestatus(b: string, i: number): void {
      if (this.allVisibleStatus[b][i]) {
        this.allVisibleStatus[b][i].type = !this.allVisibleStatus[b][i].type
      }
    },
    getVisiblestatus(b: string, i: number): boolean {
      if (this.allVisibleStatus[b][i]) return this.allVisibleStatus[b][i].type
      return true
    },
    getValidItem(b: string, i: number, g: string): boolean {
      if (this.dataFields[b][i]) {
        if (this.dataFields[b][i][g] !== undefined) return !this.dataFields[b][i][g]
      }
      return false
    },
    getFieldType(d: Iobject, g: string): string {
      if (!Array.isArray(d[g]) && g !== 'company' && !this.inv.includes(g)) {
        return this.textarea.includes(g) ? 'textarea' : 'input'
      }
      if (!Array.isArray(d[g]) && g === 'company' && !this.inv.includes(g)) return 'select'
      if (Array.isArray(d[g]) === true) return 'array'
      return ''
    },
    getObjectKeys(ob: Iobject): any {
      return Object.keys(ob)
    },
    removeItem(item: Iobject, index: any, parent: Iobject, type: string): void {
      const delId = item.id
      if (delId === -1) {
        openPopupDialog('Удалить?')
          .then((result: boolean) => {
            if (result !== true) return
            parent.splice(index, 1)
            if (type === 'company') {
              this.board.contacts.data.forEach((i: Iobject, ind: any) => {
                console.log(this.board.contacts.data[ind])
                if (i.company === delId) this.board.contacts.data[ind].company = null
              })
            }
          })
      }
    },
    saveData(): void {
      if (this.type.startsWith('add') === true) this.saveDataAdd()
    },
    async saveDataAdd(): Promise<void> {
      console.log('board', this.board)
      if (this.board.company?.data[0]) {
        let insertRequest = getInsertRequest([this.board.company.data[0]], tables.company)
        console.log('insert company request', insertRequest)
        this.$store.dispatch('app/setLoader', { data: true })
        crmApi.sendAndGetData(insertRequest)
          .then((result: Iobject) => {
            console.log('insert сompany result', result)
            const company = result.inserted[0][tables.company]
            if (this.board.contacts?.data?.length > 0) {
              this.board.contacts.data.forEach((c: Iobject) => {
                if (c.company === -1) c.company = company
              })
              insertRequest = getInsertRequest(this.board.contacts.data, tables.contacts)
              console.log('insert contacts request', insertRequest)
              return crmApi.sendAndGetData(insertRequest)
            } 
            return { data: true }
          })
          .catch((error: Error) => {
            console.warn('error insert contacts', JSON.stringify(error))
            const answers = [{ name: 'Ok', result: true }]
            openPopupDialog('Ошибка при сохранении компании', answers)
          })
          .then(() => {
            this.saveDataAddSuccess()
          })
      } else {
        if (this.board.contacts?.data?.length === 0) return
        const insertRequest = getInsertRequest(this.board.contacts.data, tables.contacts)
        console.log('insert contacts request', insertRequest)
        crmApi.sendAndGetData(insertRequest)
          .then((result: Iobject) => {
            console.log('insert contacts result', result)
          })
          .catch((error: Error) => {
            console.warn('error insert contacts', JSON.stringify(error))
            const answers = [{ name: 'Ok', result: true }]
            openPopupDialog('Ошибка при сохранении контактов', answers)
          })
          .then(() => {
            this.saveDataAddSuccess()
          })
      }
    },
    saveDataAddSuccess(): void {
      this.$store.dispatch('app/setLoader', { data: false })
      const answers = [{ name: 'Ok', result: true }]
      openPopupDialog('Данные сохранены!', answers)
        .then(() => {
          if (this.type === 'add') this.init()
          if (this.type === 'addPopup') this.$emit('stopPopup')
        })
    },
    addItem(item: Iobject, itemName: string): void {
      if (itemName === 'company') {
        item.push(cloneObj(this.addingInit[itemName]))
      }
      if (itemName === 'contacts') {
        if (this.board.company?.data.length === 0) {
          item.push(cloneObj(this.addingInit[itemName]))
          return
        }
        const t = cloneObj(this.addingInit[itemName])
        t.company = this.board.company?.data[0].id || null
        item.push(t)
      }
    },
  },
} as Iobject
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';

.add-company-contacts {
  min-width: $min-width-body;
  max-width: $max-width-body;
}

.item {
    font-size: 0;

    &__half {
        display: inline-block;
        font-size: 13px;
        width: 85%;
        padding: 5px;
        box-sizing: border-box;
        vertical-align: top;
        padding-right: 20px;

        > div {
            position: relative;
        }

        .--options {
          padding: 5px 3px;

          &-button {
            color: #999;
            border-bottom: 1px dashed #999;
            cursor: pointer;
          }
        }
    }

    &__half.left {
        text-align: right;
        width: 15%;
        padding-right: 5px;
    }

    &__board {
      padding: 15px 15px 10px;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid #ccc;
      margin-top: -1px;
      border-radius: 3px;
    }

    &__title {
        display: inline-block;
        padding: 10px 3px 0;
    }

    &__del {
        position: absolute;
        top: 3px;
        right: 3px;
        cursor: pointer;
    }

}
.right__item {
    display: inline-block;
    vertical-align: top;
    min-width: 220px;
    margin: 4px 4px 0 0;
}

.right__item:empty {
    display: none;
}
</style>
