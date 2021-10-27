<template>
    <div id="draggable" v-if="itemParent !== null">

        <draggable :list="itemParent[itemName]"
            class="list-group"
            :disabled="!enabled.status"
            handle=".item__handle"
            @start="setDraggingStatus(true, itemParent[itemName])"
            @end="setDraggingStatus(false, itemParent[itemName])"
            v-bind="dragOptions"
        >
            <div class="list-group-item" v-for="(el, index) in itemParent[itemName]" :key="index">
                <div>
                    <h3>{{ p[itemName] }}</h3>
                    <span class="item__del" 
                      :disabled="disabled"
                      @click="replaceDragItem(itemParent[itemName], index)"
                    >
                        &#10006;
                    </span>
                    <span class="item__handle"></span>
                    <div class="items" v-for="(d, i) in cloneAndObjectKeys(el)" :key="d + i">
                      <div v-if="showedItem(d)">

                        <CustomInput class="items__input"
                          v-if="!scheme[d] || scheme[d].list === null"
                          type="text"
                          :parent="el"
                          :item="d"
                          :disabled="getDisabled(mode, d)"
                          :placeholder="`${p[d]}${scheme[d] && scheme[d].units ? ', ' + scheme[d].units : ''}`"
                          :novalid="validOb[index][d]"
                          @keyup="changeDealData(el, validOb[index], d, root, 'keyup')"
                          @blur="changeDealData(el, validOb[index], d, root)"
                        />
                        <CustomSelect v-if="scheme[d] && scheme[d].list !== null"
                          class="scheme-item__select"
                          :disabled="getDisabled(mode, d)"
                          :id="getItemId(d)"
                          :itemParent="el"
                          :itemName="d"
                          :options="scheme[d].list"
                          :scheme="scheme"
                          :data-novalid="validOb[index][d]"
                          :validOb="validOb[index]"
                          :root="root"
                          @changeDealData="changeDealData(el, validOb[index], d, root)"
                        />

                      </div>

                      <div v-if="addingInit[d]" class="items__add">
                          <Draggable
                            :disabled="getDisabled(mode, d)"
                            :mode="mode"
                            :itemParent="el"
                            :itemName="d"
                            :scheme="scheme"
                            :validOb="validOb[index][d]"
                            :root="root"
                            @changeDealData="changeDealData"
                          />
                      </div>

                    </div>
                </div>
            </div>
        </draggable>
        <div class="list-group-add">
            <span class="cap"
                :disabled="disabled"
                @click="addDragItem(itemParent[itemName], itemName)"
            >Добавить {{ p[itemName] }}</span>
        </div>

    </div>
</template>

<script lang="ts">
import draggable from 'vuedraggable'
import CustomSelect from '@/components/atoms/CustomSelect.vue'
import { 
  addingInit,
  phrases,
} from '@/conf/deals/dealsData'
import { getNowSecods, cloneObj } from '@/utils'
import m from '@/mixins/m'
import { openPopupDialog } from '@/store/plugins/generalFunctions'
import CustomInput from '@/components/atoms/CustomInput.vue'

interface Iobject {
  [key: string]: any
}

export default {
  name: 'Draggable',
  mixins: [m],
  components: {
    draggable,
    CustomSelect,
    CustomInput,
  },
  props: {
    itemParent: { required: true },
    itemName: { required: true },
    scheme: { required: true },
    validOb: { required: true },
    root: { required: true },
    mode: { required: true },
    disabled: { required: true },
  },
  data() {
    return {
      enabled: { status: true },
      contacts: '',
      dragging: false,
      adding: null,
      addingInit,
    }
  },
  mounted(): void {
    this.adding = cloneObj(this.addingInit)
  },
  watch: {
    popup(val: null | Iobject): void {
      this.enabled.status = val === null
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 400,
        disabled: true,
        ghostClass: 'ghost',
      }
    },
    p() {
      return phrases
    },
  },
  methods: {
    changeDealData(...args: any): void {
      this.$emit('changeDealData', ...args)
    },
    showedItem(d: any) {
      return (d !== 'ord' && d !== 'datetime' && !addingInit[d])
    },
    cloneAndObjectKeys(ob: Iobject): string[] {
      return Object.keys(cloneObj(ob))
    },
    setDraggingStatus(status: boolean, ob: Iobject): void {
      this.dragging = status
      if (status === false) {
        let i = 0
        if (ob.datetime !== undefined) ob.datetime = getNowSecods()
        ob = ob.map((item: Iobject) => {
          const t = item
          t.ord = i
          i += 1
          return t
        })
      }
      this.$emit('changeDealData', this.itemParent, this.validOb, this.itemName, this.root)
    },
    addDragItem(ob: Iobject, d: string): void {
      if (this.disabled === true) return
      this.adding[d].ord = ob.length
      if (this.adding[d].datetime !== undefined) {
        this.adding[d].datetime = getNowSecods()
      }
      const adding: Iobject = cloneObj(this.adding[d])
      ob.push(adding)
      this.adding = cloneObj(this.addingInit)
    },
    replaceDragItem(ob: Iobject, index: number): void {
      if (this.disabled === true) return
      openPopupDialog('Удалить пункт?').then((result: any) => {
        if (result === true) {
          ob.splice(index, 1)
          this.setDraggingStatus(false, ob)
        }
      })
    },
    inputMousemove(): void {
      if (this.enabled.status === true) this.enabled.status = false
    },
    inputMouseleave(): void {
      this.enabled.status = true
    },
  },
} as Iobject
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';

.list-group {
  width: 700px;

  &-item {
    padding: 0 10px 10px 20px;
    width: 100%;
    position: relative;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-left: 2px solid #ccc;
    background: #fff;
    position: relative;

    .list-group-item {
      width: 650px;
    }

    h3 {
      padding: 6px;
    }

    .item__del {
        position: absolute;
        top: 3px;
        right: 3px;
        cursor: pointer;
    }

    .item__del[disabled] {
        opacity: $disabled-opacity;
    }

    .item__handle {
        position: absolute;
        top: 7px;
        left: 5px;
        display: inline-block;
        width: 14px;
        height: 14px;
        background: linear-gradient($brown 50%, #fff 50%);
        background-size: 100% 4px;
        cursor: move;
    }
  }

  .items {
      display: inline-block;
      vertical-align: top;
      padding: 3px;

      .select__input-result {
        padding: 3px;
        width: 150px;
      }

      &__input {
          width: 150px;
      }
  }

  .items:empty {
    display: none;
  }

  .sortable-chosen {
    background: #fff;
    opacity: 1;

    .item__handle {
        background: linear-gradient(#fff 50%, rgb(225, 186, 186) 50%);
        background-size: 100% 4px;
    }
  }

  .ghost {
    background:rgb(225, 186, 186);
    border: 1px solid rgb(225, 186, 186);
  }
}

.list-group-add {
    display: inline-block;
    padding: 3px;
    cursor: default;

    .cap {
      cursor: pointer;
      display: inline-block;
      padding: 3px 12px;
      border: 1px dashed #999;
      border-radius: 20px;
      font-size: 13px;
    }

    .cap[disabled] {
      opacity: $disabled-opacity;
    }
}

</style>
