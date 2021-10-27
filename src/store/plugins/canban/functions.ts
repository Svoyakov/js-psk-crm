import { cloneObj, getNowSecods } from '@/utils'
import { tables, jsonParseKeys } from '@/conf/tables'

interface Iobject {
    [key: string]: any
}

export function getHistoryReqToTable(args: Iobject): Iobject {
  const { text, dealId, userId } = args
  return {
    table: tables.canbanHistory,
    type: 'insert',
    items: [
      {
        name: 'datetime',
        value: getNowSecods(),
      },
      { name: 'text', value: text },
      { name: 'dealId', value: dealId },
      { name: 'userId', value: userId },
    ],
  }
}

export function changeCabnanArrayPosition(args: Iobject): Iobject {
  const {
    sortedCanban, from, to, position, stage, user, canbanStages,
  } = args
  let indexFrom: null | number = null
  let indexTo: null | number = null
  let prevStage: null | number = null
  let actionChangeStage: null | Iobject = null
  let history: null | Iobject = null

  for (let i = 0; i < sortedCanban.length; i += 1) {
    if (sortedCanban[i].id === from) {
      indexFrom = i
      prevStage = sortedCanban[i]['stage.type']
    }
    if (to !== null && sortedCanban[i].id === to) indexTo = i
    if (to === null && sortedCanban[i]['stage.type'] === stage) indexTo = i
    if (indexFrom && indexTo) break
  }
  if (indexTo === null) indexTo = sortedCanban.length - 1

  if (indexFrom === null || indexTo === null) {
    return new Error(`Нет какого-то из членов изменяемого массива,
  indexFrom: ${indexFrom}, indexTo: ${indexTo}`)
  }

  const getCanbanOrderedData: Iobject = cloneObj(sortedCanban)
    .map((item: Iobject) => item.id)
  const datetime = getNowSecods()

  if (position === 'down') indexTo += 1
  getCanbanOrderedData.splice(indexTo, 0, from)
  if (indexTo <= indexFrom) indexFrom += 1
  getCanbanOrderedData.splice(indexFrom, 1)

  if (prevStage !== stage) {
    actionChangeStage = {
      table: tables.canbanData,
      id: from,
      nameId: 'id',
      type: 'change',
      items: [
        {
          name: 'stage.type',
          value: stage,
        },
        {
          name: 'stage.datetime',
          value: datetime,
        },
      ],
    }
    history = getHistoryReqToTable({
      text: `Изменена стадия на ${canbanStages[stage].name}`,
      dealId: from,
      userId: user.data.id,
    })
  }

  const changeSend: Iobject = {
    datetime,
    callbacks: [
      {
        table: tables.canbanData, nameId: 'id', id: from, compare: '=', 
      },
      {
        table: tables.canbanOrder, nameId: 'catId', id: sortedCanban[0].catId, compare: '=', 
      },
    ],
    actions: [
      {
        table: tables.canbanOrder,
        id: sortedCanban[0].catId,
        nameId: 'catId',
        type: 'change',
        items: [
          {
            name: 'ord',
            value: JSON.stringify(getCanbanOrderedData),
          },
        ],
      },
    ],
  }

  if (actionChangeStage !== null) changeSend.actions.push(actionChangeStage)
  if (history !== null) changeSend.actions.push(history)

  console.log('changeSend', changeSend)

  return changeSend
}

export function getFullUnFlat(obj: Iobject): Iobject {
  const unflatted: Iobject[] = []
  obj.forEach((item: Iobject, index: number) => {
    unflatted[index] = {}
    Object.keys(item).forEach((key: string) => {
      const arrKey = key.split('.')
      if (arrKey.length === 1) unflatted[index][key] = (jsonParseKeys[key] ? JSON.parse(item[key]) : item[key])
      if (arrKey.length > 1) {
        let r = unflatted[index]
        arrKey.forEach((k: string, i: number) => {
          if (!r[k] && i < arrKey.length - 1) r[k] = {}
          if (i === arrKey.length - 1) {
            r[k] = (jsonParseKeys[key] ? JSON.parse(item[key]) : item[key])
          }
          r = r[k]
        })
      }
    })
  })
  return unflatted
}

export function getUnFlat(obj: Iobject): Iobject {
  const unflatted: Iobject[] = []
  obj.forEach((item: Iobject, index: number) => {
    unflatted[index] = {}
    Object.keys(item).forEach((key: string) => {
      unflatted[index][key] = (jsonParseKeys[key] ? JSON.parse(item[key]) : item[key])
    })
  })
  return unflatted
}

export function getFlat(flat: Iobject, o: Iobject, prefix = ''): Iobject {
  Object.keys(o).forEach((item) => {
    const ind = `${prefix ? `${prefix}.` : ''}${item}`
    const isArray = Array.isArray(o[item]) === true
    if (typeof o[item] === 'object' && isArray === false) {
      getFlat(flat, o[item], ind)
    } else {
      flat[ind] = isArray ? JSON.stringify(o[item]) : o[item]
    }
  })
  return flat
}
