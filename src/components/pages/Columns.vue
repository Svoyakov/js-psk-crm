<template>
  <div>
    <div class="top">
      <span class="top__item">
        <h1>Активные сделки в работе</h1>
        <p v-show="error === true">При загрузке произошла ошибка</p>
      </span>
    </div>

    <div class="columns"
      id="columns"
      v-if="getRouteData && getRouteData.name === 'canban' && getCanbanData !== null && error === false"
      @mousemove="mousemoveCanban($event)"
      @mousedown.middle="yScrollCanbanStart($event)"
      @mouseup.middle="yScrollCanbanStop()"
      @mouseup.left="yScrollCanbanStop()"
      :data-move="yScroll || dragId"
    >
        <div class="columns__item"
            v-for="(stage, i) in stages"
            :key="i"
        >
            <div class="columns__item-body"
                :id="'column-' + i"
                :data-hover="dragOverInesrtableColumn[i]"
                @mousemove.left="dragOverColumn($event, i)"
                @mouseleave.left="dragOverColumnLeave(i)"
            >

                <div id="columns-header" class="columns__item-header item-header">
                  <div class="item-header__body">
                    <h3 v-text="stage.name"></h3>
                    <p class="item-header__body-info" v-if="canban[i] && canban[i].length > 0">
                        {{ canban[i].length }}
                        {{ getNoun(canban[i].length, 'сделка', 'сделки', 'сделок') }}
                        на <span>{{ getPrice(canban[i]) }}</span> &#8381;
                    </p>
                    <p class="tem-header__body-info" v-if="canban[i] && canban[i].length === 0">
                        Сделок нет
                    </p>
                  </div>
                  <div v-if="i === 0" class="item-header__add-body">
                    <div class="item-header__add-body-item"
                      @click="routeGo({ name: 'add-deal' })"
                    >
                      Добавить сделку
                    </div>
                  </div>
                </div>

                <div :id="'item-' + item.id"
                    :class="'columns__item-data drag-' + drag[item.id].status"
                    :data-last="canban[i].length - 1 === indexItem"
                    :key="indexItem"
                    v-for="(item, indexItem) in canban[i]"
                    v-show="item.active === 1 && item.status === 0"
                    @click.left="gotoCanbanItem(item.id)"
                    @mousedown.left="dragStart($event, item)"
                    @mousemove.left="dragOver($event, item)"
                    @mouseleave.left="dragOverLeave($event, item)"
                >
                    <div class="columns__item-data-deal deal">
                        <div class="deal__contact">
                            <h3>
                                <span class="deal__contact-id">#{{ item.id }}</span>,
                                <span class="deal__contact-name"
                                  v-html="noData(item['company.name'], 'Нет названия компании')"
                                ></span>
                                <span  class="deal__contact-phone" v-if="checkPhone(item)">
                                  / {{ item.contacts[0].phones[0].phone }}
                                </span>
                            </h3>
                        </div>
                        <div class="deal__name-place">
                            <h4>
                                <span v-html="noData(item['deal.name'], 'Нет названия')"></span>,
                                <nobr>
                                  <span v-html="noData(item['deal.size.l'], '{Д}')"></span> x
                                  <span v-html="noData(item['deal.size.w'], '{Ш}')"></span> х
                                  <span v-html="noData(item['deal.size.h'], '{В}')"></span>
                                </nobr>
                            </h4>
                            <p>
                              <span v-html="noData(item['deal.material'], 'Не указан материал')"></span> /
                              <span v-html="noData(item['deal.city'], 'Не указан город')"></span>,
                              <span v-html="noData(item['deal.region'], 'Не указан регион')"></span>
                            </p>
                        </div>
                        <div class="deal__price">
                            <h4>{{ numberWithSpaces(item['deal.price']) }} &#8381;</h4>
                        </div>
                        <div class="deal__date-source">
                            <p>
                              <span v-html="getDate(item.datetime)"></span> /
                              <span v-html="noData(item['deal.source'], 'Не указан источник')"></span>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
  </div>
</template>

<script lang="ts">
import canbanRouteData from '@/conf/routes/pages/canban'
import { canbanStages, reloadDatetimeInterval } from '@/conf/canbanData'
import { dispatchByTable } from '@/conf/tables'
import {
  getCoords,
  getNoun,
  numberWithSpaces,
  getDate,
  cloneObj,
} from '@/utils'
import {
  changeCabnanArrayPosition,
  getUnFlat,
} from '@/store/plugins/canban/functions'
import CrmApi from '@/services/crmApi'
import m from '@/mixins/m'

const crmApi = new CrmApi()

interface Iobject {
  [key: string]: any
}

export default {
  name: 'Columns',
  mixins: [m],
  components: {},
  data(): Iobject {
    return {
      stages: canbanStages,
      canban: {},
      drag: {},
      dragId: null,
      dragTimeout: 200,
      dragSetTimeout: null,
      dragOverInesrtable: null,
      dragOverInesrtableColumn: [],
      dragClone: null,
      isChangeItemPosition: null,
      catId: 1,
      sortedCanban: [],
      canbanByStages: {},
      yScroll: null,
      isSorting: false,
      error: null,
    }
  },
  mounted(): void {
    const app = document.getElementById('app')
    if (!app) return
    app.addEventListener('mouseleave', this.dragStop)
    app.addEventListener('mouseup', this.dragStop)
  },
  beforeDestroy(): void {
    const app = document.getElementById('app')
    if (!app) return
    app.removeEventListener('mouseleave', this.dragStop)
    app.addEventListener('mouseup', this.dragStop)
  },
  computed: {},
  watch: {
    getCanbanOrder(): void {
      this.initialCanbanAndSortDataAndByStage(false)
    },
    getRouteData(): void {
      this.initialCanbanAndSortDataAndByStage(true)
    },
    getCanbanData(): void {
      this.initialCanbanAndSortDataAndByStage(false)
    },
  },
  methods: {
    getNoun(amount: number, one: string, two: string, five: string): string {
      return getNoun(amount, one, two, five)
    },
    getPrice(items: Iobject): string {
      let price = 0
      items.forEach((item: Iobject) => {
        price += item['deal.price']
      })
      return this.numberWithSpaces(price)
    },
    numberWithSpaces(x: number): string {
      return numberWithSpaces(x)
    },
    getDate(datetime: number): string {
      return getDate(datetime)
    },
    dragOverColumnLeave(stage: number): void {
      if (this.dragOverInesrtableColumn[stage] === null) return
      this.$set(this.dragOverInesrtableColumn, stage, null)
      this.isChangeItemPosition = null
    },
    dragOverColumn(e: Iobject, stage: number): void {
      if (this.dragId === null) return
      if (this.dragOverInesrtable || e.target.closest('#columns-header')) {
        if (this.dragOverInesrtableColumn[stage] !== null) this.$set(this.dragOverInesrtableColumn, stage, null)
        if (this.isChangeItemPosition?.to === null) this.isChangeItemPosition = null
        return
      }

      if (this.dragOverInesrtableColumn[stage] !== true) {
        this.$set(this.dragOverInesrtableColumn, stage, true)
        this.isChangeItemPosition = {
          from: this.dragId,
          to: null,
          position: 'down',
          stage,
        }
      }
    },
    dragOverLeave(e: Iobject, item: Iobject): void {
      if (this.dragId === null) return
      if (this.dragOverInesrtable === true) this.dragOverInesrtable = null
      if (item.id === this.dragId) return

      this.drag[item.id].status = 'none'
      this.isChangeItemPosition = null
    },
    dragOver(e: Iobject, item: Iobject): void {
      if (this.dragId === null) return
      if (this.dragOverInesrtable !== true) this.dragOverInesrtable = true
      if (item.id === this.dragId) return

      const block = document.getElementById(`item-${item.id}`)
      if (!block) return

      const o = getCoords(block)
      const { height } = block.getBoundingClientRect()
      if ((e.clientY ?? e.pageY) > o.top - window.pageYOffset + height / 2) {
        this.drag[item.id].status = 'down'
      } else {
        this.drag[item.id].status = 'up'
      }
      this.isChangeItemPosition = {
        from: this.dragId,
        to: item.id,
        position: this.drag[item.id].status,
        stage: item['stage.type'],
      }
    },
    dragStart(e: Iobject, item: Iobject): void {
      this.dragSetTimeout = setTimeout(() => {
        const block = document.getElementById(`item-${item.id}`)
        const parent = document.getElementById(`column-${item['stage.type']}`)
        if (!block || !parent) return
        const coords = getCoords(block)
        this.drag[item.id].status = 'go'
        this.drag[item.id].x = coords.left - window.pageXOffset
        this.drag[item.id].y = coords.top - window.pageYOffset
        this.drag[item.id].xM = e.clientX ?? e.pageX
        this.drag[item.id].yM = e.clientY ?? e.pageY
        this.dragId = item.id
        this.addClone(coords, block, parent)
      }, this.dragTimeout)
    },
    dragStop(e: Iobject): void {
      if (e.button > 0) return
      setTimeout(() => {
        if (this.dragSetTimeout) {
          clearTimeout(this.dragSetTimeout)
          this.dragSetTimeout = null
        }

        if (this.drag[this.dragId]?.status !== 'go') return
        if (this.isChangeItemPosition === null) {
          this.dragSlideBack()
          return
        }

        this.$store.dispatch('app/setLoader', { data: true })
        this.drag[this.dragId].status = 'freeze'
        try {
          const cp = this.isChangeItemPosition
          const changes = changeCabnanArrayPosition({
            sortedCanban: this.sortedCanban,
            from: cp.from,
            to: cp.to,
            position: cp.position,
            stage: cp.stage,
            user: this.getUser,
            canbanStages,
          })
          this.completeDrag(changes)
        } catch (error) {
          console.log('Error newGetCanbanData:', error)
          this.dragSlideBack()
        }
      }, 0)
    },
    dragGo(e: Iobject): void {
      if (this.drag[this.dragId]?.status === 'go') {
        const left = this.drag[this.dragId].x - this.drag[this.dragId].xM + e.clientX ?? e.pageX - window.pageXOffset
        const top = this.drag[this.dragId].y - this.drag[this.dragId].yM + e.clientY ?? e.pageY - window.pageYOffset
        this.dragClone.style.left = `${left}px`
        this.dragClone.style.top = `${top}px`
      }
    },
    dragSlideBack(): void {
      Object.keys(this.drag).forEach((i: string) => {
        if (this.drag[i].status !== 'none') this.drag[i].status = 'none'
      })
      this.dragClone.classList.add('drag-back')
      this.dragClone.style.left = `${this.drag[this.dragId].x}px`
      this.dragClone.style.top = `${this.drag[this.dragId].y}px`
      this.defaultAfterDrag()
    },
    removeClone(): void {
      setTimeout(() => {
        this.dragClone.parentNode.removeChild(this.dragClone)
        this.dragClone = null
      }, 150)
    },
    addClone(coords: Iobject, block: HTMLElement, parent: HTMLElement): void {
      this.dragClone = block.cloneNode(true)
      parent.appendChild(this.dragClone)
      const { width } = this.dragClone.getBoundingClientRect()
      this.dragClone.id = 'clone'
      this.dragClone.style.position = 'fixed'
      this.dragClone.style.width = `${width}px`
      this.dragClone.style.left = `${coords.left - window.pageXOffset + 5}px`
      this.dragClone.style.top = `${coords.top - window.pageYOffset + 5}px`
      this.dragClone.style.padding = '10px'
      this.dragClone.style.background = '#ccc'
    },
    defaultAfterDrag(): void {
      this.drag[this.dragId].x = null
      this.drag[this.dragId].y = null
      this.drag[this.dragId].xM = null
      this.drag[this.dragId].yM = null
      this.dragId = null
      this.stages.forEach((_item: Iobject, index: number) => {
        this.dragOverInesrtableColumn[index] = null
      })
      this.dragOverInesrtable = null
      this.removeClone()
      this.$store.dispatch('app/setLoader', { data: false })
      Object.keys(this.drag).forEach((i: string) => {
        if (this.drag[i].status !== 'none') this.drag[i].status = 'none'
      })
    },
    async completeDrag(change: Iobject): Promise<void> {
      crmApi.sendAndGetData(change).then((result: Iobject) => {
        console.log('result', result)
        result.data.forEach((item: Iobject) => {
          if (!dispatchByTable[Object.keys(item)[0]]) return
          const datetime = Math.round(new Date().getTime() / 1000)

          if (dispatchByTable[Object.keys(item)[0]] === 'app/setCanbanData') {
            const can = cloneObj(this.getCanbanData)

            const unFlat = getUnFlat(item[Object.keys(item)[0]])
            const canData: Iobject[] = []
            can.data.forEach((deal: Iobject) => {
              if (deal.id === unFlat[0].id) {
                canData.push(unFlat[0])
              } else {
                canData.push(deal)
              }
            })
            can.data = canData
            this.$store.dispatch(dispatchByTable[Object.keys(item)[0]], {
              data: can,
            })
          }

          if (dispatchByTable[Object.keys(item)[0]] === 'app/setCanbanOrder') {
            const ordrData = item[Object.keys(item)[0]]
            this.$store.dispatch(dispatchByTable[Object.keys(item)[0]], {
              data: {
                datetime,
                data: JSON.parse(ordrData[0].ord),
              },
            })
          }
        })
        this.defaultAfterDrag()
      }).catch((error: Iobject) => {
        console.warn('error crmApi.sendAndGetData', error)
        this.defaultAfterDrag()
      })
    },
    async initialCanbanAndSortDataAndByStage(load: boolean): Promise<void> {
      if (this.$route.name !== canbanRouteData.name) return
      if (this.getUser === null) this.routeGo({ name: 'auth' })
      if (this.isSorting === true) return
      this.isSorting = true
      if (this.error !== null) this.error = null

      const datetime = Math.round(new Date().getTime() / 1000)
      const lastCanbanDataTime = this.getCanbanData?.datetime ?? 0
      if (load === false || datetime - lastCanbanDataTime < reloadDatetimeInterval) {
        this.sortCanban()
        return
      }
      this.$store.dispatch('app/setLoader', { data: true })
      crmApi.getCanbanData(this.catId).then((result: Iobject) => {
        console.log('result', result)
        this.$store.dispatch('app/setCanbanData', {
          data: {
            datetime,
            data: getUnFlat(result.data.deals),
          },
        })
        this.$store.dispatch('app/setCanbanOrder', {
          data: {
            datetime,
            data: result.data.order,
          },
        })
        this.sortCanban()
      }).catch((error: Iobject) => {
        console.warn('error crmApi.getCanbanData', error)
        this.error = true
      }).then(() => {
        setTimeout(() => {
          this.$store.dispatch('app/setLoader', { data: false })
          this.isSorting = false
        }, 50)
      })
    },
    sortCanban(): void {
      this.error = false
      const can = cloneObj(this.getCanbanData.data)
      const ord = cloneObj(this.getCanbanOrder.data)
      this.sortedCanban = []
      this.canbanByStages = {}
      const canbanItemById: Iobject = {}
      const sortedIds: number[] = []

      can.forEach((item: Iobject) => {
        canbanItemById[item.id] = item
        sortedIds.push(item.id)
        this.$set(this.drag, item.id, {
          status: 'none', x: null, y: null, xM: null, yM: null,
        })
      })
      ord.forEach((id: number) => {
        if (canbanItemById[id]) {
          this.sortedCanban.push(canbanItemById[id])
        }
      })
      if (this.sortedCanban.length < can.length) {
        sortedIds.filter((x) => !ord.includes(x)).forEach((id: number) => {
          this.sortedCanban.push(canbanItemById[id])
        })
      }
      this.sortedCanban.forEach((item: Iobject) => {
        if (!this.canbanByStages[item['stage.type']]) this.canbanByStages[item['stage.type']] = []
        this.canbanByStages[item['stage.type']].push(item)
      })

      this.stages.forEach((stage: Iobject, index: number) => {
        this.$set(this.dragOverInesrtableColumn, index, null)
        this.$set(
          this.canban,
          index,
          this.canbanByStages[index] || [],
        )
      })
      setTimeout(() => {
        this.isSorting = false
      }, 50)
    },
    yScrollCanbanStart(e: Iobject): void {
      const columns = document.getElementById('columns')
      if (columns) this.yScroll = e.clientX + columns.scrollLeft
    },
    yScrollCanbanStop(): void {
      this.yScroll = null
    },
    yScrollCanbanMove(e: Iobject): void {
      if (this.yScroll === null) return
      const columns = document.getElementById('columns')
      if (columns) columns.scrollLeft = this.yScroll - e.clientX
    },
    mousemoveCanban(e: Iobject): void {
      this.dragGo(e)
      this.yScrollCanbanMove(e)
    },
    gotoCanbanItem(id: number) {
      if (this.dragId !== null) return
      this.routeGo({ name: 'canbanDeal', params: { id } })
    },
  },
} as Iobject
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/general.scss';

#clone {
    pointer-events: none;
}

.columns::-webkit-scrollbar {
  height: 9px;
  border-radius: 10px;
  background-color:#ccc;
}

.columns::-webkit-scrollbar-thumb {
  background-color: $brown;
  border-radius: 10px;
}

.columns[data-move] {
  cursor: move;

  .deal {
    cursor: move;
  }
}

.columns {
  width: auto;
  overflow: auto;
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;

  &__item {
    display: inline-block;
    vertical-align: top;
    min-width: 25%;
    padding: 0 8px 20px;

    &-body[data-hover]:after {
        content: "";
        display: inline-block;
        width: 100%;
        height: 70px;
        background: #fff;
    }

    &-body {
      width: 100%;
      background: #F1F1F1;
      border: 1px solid #E6E6E6;
      box-sizing: border-box;
      border-radius: 10px 10px 0px 0px;
      white-space: normal;
      user-select: none;
      height: 100%;

      .item-header {

        &__body {
          padding: 5px 20px;
          border-bottom: 1px solid #E6E6E6;

          &-info {
            font-family: $font-light;
            padding-bottom: 15px;

            span {
              color: $brown;
            }
          }
        }

        &__add-body {
          padding: 10px;

          &-item {
            padding: 15px 10px;
            text-align: center;
            border: 1px dashed $light-brown;
            color: $brown;
            border-radius: 5px;
            cursor: pointer;
            transition: border 0.2s;
          }

          &-item:hover {
            border: 1px dashed $brown;
          }
        }

      }

      .columns__item-data {
        padding: 10px 10px 0;
        background: #fff;

        &-deal {
          width: 100%;
          border: 1px solid #E6E6E6;
          box-sizing: border-box;
          border-radius: 5px;
          padding: 20px;
          transition: 0.2s;
        }

        &-deal:hover {
          border: 1px solid #D6C3AF;
        }
      }

      .columns__item-data[data-last] {
          padding-bottom: 10px;
      }

      .drag-go > div {
          background: #f1f1f1;
      }

      .drag-back {
          transition: 0.15s;
      }

      .drag-up:before,
      .drag-down:after {
          content: "";
          display: inline-block;
          width: 100%;
          height: 70px;
      }

    }
  }

  &__item:first-child {
    padding-left: 0;
  }
  &__item:last-child {
    padding-right: 0;
  }

  .deal {
    cursor: pointer;

    &__contact {
      h3 {
        padding-top: 0;
      }

      &-phone {
        font-family: $font-light;
      }

    }

    &__name-place {
      h4 {
        font-size: 15px;
        line-height: 18px;
        padding: 0;
        color: $brown;
      }
      p {
        font-family: $font-light;
      }
    }

    &__price {
      h4 {
        font-family: $font-light;
        color: $brown;
      }
    }

    &__date-source {
      p {
        font-family: $font-light;
      }
    }
  }

}
</style>
