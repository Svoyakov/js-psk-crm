import store from '@/store'
import CrmApi from '@/services/crmApi'
import { reloadUsersInterval, reloadCanbanDealInterval } from '@/conf/reloadTimers'
import { tables } from '@/conf/tables'
import { getUnFlat } from '@/store/plugins/canban/functions'
import { getNowSecods } from '@/utils'

const crmApi = new CrmApi()

interface Iobject {
    [key: string]: any
}

export function getInsertRequest(data: Iobject[], table: string): Iobject {
  const insert: Iobject[] = []
  data.forEach((da: Iobject, i: number) => {
    insert[i] = []
    Object.keys(da).forEach((key: string) => {
      if (key === 'id') return
      let d = da[key]
      d = Array.isArray(d) ? JSON.stringify(d).replace(/null/g, '""') : d
      insert[i].push({ 
        name: key,
        value: d === null ? '' : d, 
      })
    })
  })
  const actions: Iobject[] = []
  insert.forEach((i: Iobject) => {
    actions.push({ table, type: 'insert', items: i })
  })
  const insertRequest: Iobject = {
    actions,
    datetime: getNowSecods(),
  }
  return insertRequest
}

let resolvePopup: any = null
export function resolveOpenPopupDialog(status: string | boolean): void {
  resolvePopup(status)
}
export function openPopupDialog(question: string, answers: Iobject | null = null): Promise<any> {
  if (answers === null) {
    answers = [
      { name: 'Да', result: true },
      { name: 'Нет', result: false },
    ] 
  }
  store.dispatch('app/setPopupDialog', { 
    data: { question, answers },
  }) 
  return new Promise<any>((resolve: any) => {
    resolvePopup = resolve
  }).then((result: any) => {
    store.dispatch('app/setPopupDialog', { data: null })
    return result
  })
}

export async function getCanbanDeal(id: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const datetime = store.getters['app/getCanbanDeal']?.datetime
    const isDealId = store.getters['app/getCanbanDeal']?.data?.id || -1
    if (isDealId !== id || !datetime || datetime < getNowSecods() - reloadCanbanDealInterval) {
      const getCanbanDealById: Iobject = {
        datetime: getNowSecods(),
        callbacks: [
          {
            table: tables.canbanData, nameId: 'id', id, compare: '=', 
          },
        ],
      }
      crmApi.sendAndGetData(getCanbanDealById).then((result: Iobject) => {
        store.dispatch('app/setCanbanDeal', {
          data: {
            datetime: getNowSecods(),
            data: getUnFlat(result.data[0][tables.canbanData])[0],
          },
        })
        resolve(true)
      }).catch((error: Error) => {
        reject(error)
      })
    } else {
      resolve(false)
    }
  })
}

export async function getUsers(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const datetime = store.getters['app/getUsers']?.datetime
    if (!datetime || datetime < getNowSecods() - reloadUsersInterval) {
      const getAllUsers: Iobject = {
        datetime: getNowSecods(),
        callbacks: [
          { table: tables.users },
        ],
      }
      crmApi.sendAndGetData(getAllUsers).then((result: Iobject) => {
        store.dispatch('app/setUsers', { 
          data: {
            datetime: getNowSecods(),
            data: result.data[0].users,
          },
        })
        resolve(true)
      }).catch((error: Error) => {
        reject(error)
      })
    } else {
      resolve(false)
    }
  })
}
