<template>
    <div class="popup-dialog" v-if="getPopupDialog !== null" id="board-wrap">
        <div class="popup-dialog__board board" id="board">
            <h3>{{ getPopupDialog.question }}</h3>
            <br />
            <div class="board__buttons">
                <span class="board__del" @click="getClick('')">
                    &#10006;
                </span>
                <button v-for="(a, index) in getPopupDialog.answers" 
                    :key="index"
                    @click="getClick(a.result)"
                >
                    {{ a.name }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import m from '@/mixins/m'
import { resolveOpenPopupDialog } from '@/store/plugins/generalFunctions'

interface Iobject {
  [key: string]: any
}

export default {
  name: 'PopupDialog',
  mixins: [m],
  components: {},
  data(): Iobject {
    return {}
  },
  mounted(): void {
    document.addEventListener('click', this.documentClick)
    document.addEventListener('keydown', this.documentKeyup)
  },
  beforeDestroy(): void {
    document.removeEventListener('click', this.documentClick)
    document.removeEventListener('keydown', this.documentKeyup)
  },
  methods: {
    getClick(a: any): void {
      resolveOpenPopupDialog(a)
    },
    documentClick(e: Iobject): void {
      if (this.getPopupDialog === null || e.target.closest('#board-wrap') === null) return
      if (e.target.closest('#board') === null) resolveOpenPopupDialog('')
    },
    documentKeyup(e: Iobject): void {
      if (this.getPopupDialog === null) return
      if (e.keyCode === 13 && this.getPopupDialog.answers.filter((a: Iobject) => a.result === true).length > 0) {
        resolveOpenPopupDialog(true)
      }
      if (e.keyCode === 27 && this.getPopupDialog.answers.filter((a: Iobject) => a.result === false).length > 0) {
        resolveOpenPopupDialog(false)
      }
    },
  },
} as Iobject
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/general.scss';

.popup-dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    max-width: $max-width-body;
    min-width: $min-width-body;
    top: 0;
    z-index: 150;
    background: rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
}

.board {
    border: 1px solid #ccc;
    background: #fff;
    padding: 30px;
    box-sizing: border-box;
    text-align: center;
    max-width: 400px;
    position: relative;

    &__del {
        position: absolute;
        right: 3px;
        top: 3px;
        cursor: pointer;
    }
}
</style>
