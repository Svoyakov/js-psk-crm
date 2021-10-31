<template>
    <div class="custom-select"
        :id="id"
        @focus="open()"
        @blur="onBlur('focus')"
        tabindex="0"
        :disabled="disabled"
    >
        <div class="select" :data-before="before">
            <div class="select__input-result" 
              @click="open()"
              :title="realValueStrip"
            >
              <p v-html="realValue"></p>
            </div>
            <div class="select__input-body" v-if="opened">
                <div class="--choose" v-if="options.length > chooseOptionsLength">
                    <input v-model="choose"
                        :id="`choose_${id}`"
                        class="--choose-input"
                        type="text"
                        placeholder="Начните ввод..."
                        @focus="chooseFocus = true"
                        @blur="onBlur('chooseFocus')"
                    />
                </div>
                <div class="--options"
                    :id="selected !== null ? `parent-selected-${id}` : false"
                >
                    <div class="--options-item"
                        v-for="(o, i) in sortedOptions"
                        :data-mouse="selected === null"
                        :data-choosen="itemParent[itemName] === o.value"
                        :id="selected !== null && selected === i ? `selected-${selected}` : false"
                        :data-selected="selected !== null && selected === i"
                        :key="i"
                        @mousemove="moveUnderItem()"
                        @mouseenter="hovered = i"
                        @mouseleave="hovered = null"
                        @click="setValue(o)"
                    >
                        <p v-html="o.name"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

interface Iobject {
  [key: string]: any
}

export default {
  name: 'CustomSelect',
  props: {
    id: {
      type: String,
      required: true,
    },
    itemParent: {
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Выберите опцию',
    },
    scheme: {
      required: true,
    },
    validOb: {
      default: false,
    },
    disabled: {
      default: false,
    },
    root: {
      required: true,
    },
  },
  data() {
    return {
      chooseOptionsLength: 5,
      choose: '',
      focus: false,
      chooseFocus: false,
      opened: false,
      before: false,
      selected: null,
      hovered: null,
      checkToBefore: 200,
      isChoose: null,
    }
  },
  mounted(): void {
    this.defaultInstance()
    this.defaultSelect()
    document.addEventListener('click', this.documentClick)
    document.addEventListener('scroll', this.documentScroll)
    document.addEventListener('keydown', this.documentKeyup)
  },
  beforeDestroy(): void {
    document.removeEventListener('click', this.documentClick)
    document.removeEventListener('scroll', this.documentScroll)
    document.removeEventListener('keydown', this.documentKeyup)
  },
  watch: {
    focus(val: boolean): void {
      if (val === true || this.chooseFocus === true) {
        this.opened = true
      }
    },
    chooseFocus(val: boolean): void {
      if (val === true || this.focus === true) this.opened = true
    },
    opened(val: boolean): void {
      if (val === true) {
        const select = document.getElementById(this.id)
        if (!select) return
        this.before = (select.getBoundingClientRect().top > window.innerHeight - this.checkToBefore)
      } else {
        this.defaultInstance()
        this.defaultSelect()
      }
    },
    selected(val: null | number): void {
      if (val === null) return
      this.isChoose = document.getElementById(`choose_${this.id}`)
      if (val === -1 && this.isChoose) {
        this.isChoose.focus()
        return
      }
      if (this.isChoose) {
        this.chooseFocus = false
        this.isChoose.blur()
      }

      const selectBlock = document.getElementById(`${this.id}`)
      if (selectBlock) selectBlock.focus()

      setTimeout(() => {
        const select = document.getElementById(`selected-${val}`)
        const parentSelect = document.getElementById(`parent-selected-${this.id}`)
        if (!select || !parentSelect) return
        const scrollNumberItems = 3
        const parentHeight = parentSelect.getBoundingClientRect().height
        const y = select.getBoundingClientRect().height * (val + scrollNumberItems)
        parentSelect.scrollTo({
          top: (y > parentHeight ? y - parentHeight : 0),
          behavior: 'smooth',
        })
      }, 0)
    },
  },
  computed: {
    realValueStrip(): string {
      return typeof this.realValue === 'string' 
        ? this.realValue.replace(/<\/?[^>]+(>|$)/g, '')
        : false
    },
    realValue(): string {
      try {
        return this.options
          .filter((o: Iobject) => o.value === this.itemParent[this.itemName])[0].name || null
      } catch (err) {
        if (this.scheme[this.itemName] && this.scheme[this.itemName].placeholder) {
          return this.scheme[this.itemName].placeholder
        }
        if (this.itemParent[this.itemName]) return this.itemParent[this.itemName]
        return `<span class='--placeholder'>${this.placeholder}</span>`
      }
    },
    sortedOptions(): Iobject[] {
      if (this.choose === '') return this.options
      const s: Iobject[] = []
      this.options.forEach((o: Iobject) => {
        if (o.name.toLowerCase().indexOf(this.choose.toLowerCase()) >= 0) s.push(o)
      })
      this.defaultSelect()
      return s
    },
  },
  methods: {
    open(): void {
      if (this.disabled === true) return
      this.focus = true
    },
    onBlur(type: string | null = null): void {
      if (type !== null) this[type] = false
      setTimeout(() => {
        if (this.focus === false && this.chooseFocus === false) this.opened = false
      }, 100)
    },
    defaultSelect(): void {
      this.selected = null
      this.hovered = null
    },
    defaultInstance(): void {
      this.choose = ''
      this.opened = false
      this.focus = false
      this.chooseFocus = false
    },
    moveUnderItem(): void {
      if (this.selected !== null) this.selected = null
    },
    setValue(o: Iobject): void {
      this.itemParent[this.itemName] = o.value
      this.onBlur()
      this.defaultInstance()
      this.defaultSelect()
      this.$emit('change', this.itemParent, this.validOb, this.itemName, this.root)
    },
    documentClick(e: Iobject): void {
      if (this.opened === false) return
      if (e.target.closest(`#${this.id}`) === null) this.defaultInstance()
    },
    documentScroll(): void {
      if (this.opened === false) return
      const select = document.getElementById(this.id)
      if (!select) return
      this.before = (select.getBoundingClientRect().top > window.innerHeight - this.checkToBefore)
    },
    documentKeyup(e: Iobject): void {
      if (this.opened === false) return
      const startPos = this.isChoose ? -1 : 0
      if (e.keyCode === 27) this.opened = false
      if (e.keyCode === 38) {
        if (this.selected === null && this.hovered === null) {
          this.selected = 0
        } else {
          if (this.selected === null) this.selected = this.hovered
          this.selected = this.selected - 1 >= startPos
            ? this.selected - 1
            : this.sortedOptions.length - 1
        }
      }
      if (e.keyCode === 40) {
        if (this.selected === null && this.hovered === null) {
          this.selected = 0
        } else {
          if (this.selected === null) this.selected = this.hovered
          this.selected = this.selected + 1 === this.sortedOptions.length
            ? startPos
            : this.selected + 1
        }
      }
      if (e.keyCode === 13 && this.selected !== null) {
        this.setValue(this.sortedOptions[this.selected])
      }
      if ([13, 38, 40, 27].indexOf(e.keyCode) >= 0) e.preventDefault()
    },
  },
} as Iobject
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';

.select {
    width: 100%;
    display: inline-block;
    position: relative;
    cursor: default;
    user-select: none;
    font-size: 14px;
    background: #fff;

    &__input-result {
        width: auto;
        box-sizing: border-box;
        border: 1px solid #999;
        border-radius: 3px;
        font-size: 13px;
        line-height: 20px;
        position: relative;
        padding: 4px;
        white-space: nowrap;

        p {
          max-width: calc(100% - 25px);
          overflow: hidden;
        }

        .--placeholder {
            opacity: 0.5;
        }
    }

    &__input-result:after {
        content: "";
        position: absolute;
        right: 10px;
        top: 50%;
        margin-top: -2px;
        display: inline-block;
        font-size: 0;
        width: 4px;
        height: 4px;
        box-sizing: border-box;
        border: 4px solid transparent;
        border-top: 4px solid #333;
    }

    .select__input-body {
        position: absolute;
        width: auto;
        max-width: 100%;
        min-width: 150px;
        z-index: 10;
        border: 1px solid #ccc;
        border-top: 0;
        background: #fff;
        box-sizing: border-box;

        box-shadow: 0 5px 5px rgba(0,0,0,0.1);

        .--choose {
            width: 100%;
            padding: 5px;
            box-sizing: border-box;

            &-input {
                width: 100%;
                padding: 5px;
                box-sizing: border-box;
                border: 1px solid #ccc;
            }
        }

        .--options {
            max-height: 120px;
            min-height: 24px;
            height: auto;
            overflow: auto;
            position: relative;

            &-item {
                width: 100%;
                max-width: 100%;
                overflow: hidden;
                padding: 5px 10px;
                box-sizing: border-box;
                cursor: pointer;

                p {
                    padding: 0;
                    margin: 0;
                }
            }

            &-item[data-choosen] {
                background: #f7f7f7;
            }

            &-item[data-selected],
            &-item[data-mouse]:hover {
                background: #f1f1f1;
            }
        }

        .--options:empty:after {
            content: "Ничего нет";
            padding: 5px 10px;
            display: inline-block;
        }

        .--options::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        .--options::-webkit-scrollbar-thumb  {
            background: #828282;
        }

        .--options::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
    }
}
.select[data-before] {

    .select__input-body {
        border: 1px solid #ccc;
        border-bottom: 0;
        top: auto;
        bottom: 100%;
        box-shadow: 0 -5px 5px rgba(0,0,0,0.1);
    }
}

.custom-select[disabled] {
  opacity: $disabled-opacity;
}

</style>
