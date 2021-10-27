import store from '@/store'

interface Iobject {
    [key: string]: any
}

export function getNowSecods(): number {
  return Math.round(new Date().getTime() / 1000) + (store.getters['app/getDatetimeCorrect']?.data || 0)
}

export function cloneObj(arr: Iobject): Iobject {
  return JSON.parse(JSON.stringify(arr))
}

export function getCoords(elem: HTMLElement): Iobject {
  const box = elem.getBoundingClientRect()

  const { body } = document
  const docEl = document.documentElement

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft
  const clientTop = docEl.clientTop || body.clientTop || 0
  const clientLeft = docEl.clientLeft || body.clientLeft || 0
  const top = box.top + scrollTop - clientTop
  const left = box.left + scrollLeft - clientLeft

  return { top: Math.round(top), left: Math.round(left) }
}

export function getNoun(number: number, one: string, two: string, five: string): string {
  let n = Math.abs(number)
  n %= 100
  if (n >= 5 && n <= 20) {
    return five
  }
  n %= 10
  if (n === 1) {
    return one
  }
  if (n >= 2 && n <= 4) {
    return two
  }
  return five
}

export function numberWithSpaces(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function getDate(datetime: number): string {
  const months: string[] = [
    'января', 'февраля', 'марта', 'апреля',
    'мая', 'июня', 'июля', 'августа',
    'сентября', 'октября', 'ноября', 'декабря',
  ]
  const d = new Date(datetime * 1000)
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}
