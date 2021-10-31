import { canbanStages } from '@/conf/canbanData'
import r from '@/conf/deals/regions'

interface Iobject {
  [key: string]: any
}
  
export const purposes: Iobject = [
  { name: 'Ангар для вертолета', value: 'Ангар для вертолета' },
  { name: 'Ангар для самолета', value: 'Ангар для самолета' },
  { name: 'Ангар для яхт', value: 'Ангар для яхт' },
  { name: 'Производственный ангар', value: 'Производственный ангар' },
  { name: 'Складской ангар', value: 'Складской ангар' },
  { name: 'Сельскохозяйственный ангар', value: 'Сельскохозяйственный ангар' },
  { name: 'Ангары для тяжелого климата', value: 'Ангары для тяжелого климата' },
  { name: 'Раздвижные ангары', value: 'Раздвижные ангары' },
  { name: 'Обслуживание техники', value: 'Обслуживание техники' },
  { name: 'Спортивные ангары и павильоны', value: 'Спортивные ангары и павильоны' },
]

export const roofs: Iobject = [
  { name: 'Односкатная', value: 'Односкатная' },
  { name: 'Двускатная', value: 'Двускатная' },
  { name: 'Арочная', value: 'Арочная' },
  { name: 'Ломаная', value: 'Ломаная' },
]

export const materials: Iobject = [
  { name: 'Тент', value: 'Тент' },
  { name: 'Теплый тент', value: 'Теплый тент' },
  { name: 'Профлист', value: 'Профлист' },
  { name: 'Сендвич панель', value: 'Сендвич панель' },
]

const reg: Iobject = []
r.forEach((item: Iobject) => {
  reg.push({ name: item.name, value: item.name })
})
export const regions = reg

export const sources: Iobject = [
  { name: 'Калькулятор', value: 'Калькулятор' },
  { name: 'Отдел продаж', value: 'Отдел продаж' },
  { name: 'Другое', value: 'Другое' },
]

export const stageTypes: Iobject = [
  { name: canbanStages[0].name, value: 0 },
  { name: canbanStages[1].name, value: 1 },
  { name: canbanStages[2].name, value: 2 },
  { name: canbanStages[3].name, value: 3 },
  { name: canbanStages[4].name, value: 4 },
  { name: canbanStages[5].name, value: 5 },
  { name: canbanStages[6].name, value: 6 },
  { name: canbanStages[7].name, value: 7 },
]

export const responsibles: Iobject[] = []

export const statusContact: Iobject = [
  { name: 'Лицо принимающее решение', value: 'Лицо принимающее решение' },
  { name: 'Помощник', value: 'Помощник' },
]

export const gateTypes: Iobject = [
  { name: 'Распашные', value: 'Распашные' },
  { name: 'Тентовая штора', value: 'Тентовая штора' },
  { name: 'Подъемная тентовая штора', value: 'Подъемная тентовая штора' },
]

export const craneWeights: Iobject = [
  { name: '1 тонна', value: '1 тонна' },
  { name: '2 тонны', value: '2 тонны' },
  { name: '3 тонны', value: '3 тонны' },
  { name: '5 тонн', value: '5 тонн' },
  { name: '8 тонн', value: '8 тонн' },
  { name: '10 тонн', value: '10 тонн' },
  { name: '12 тонн', value: '12 тонн' },
]

export const statuses: Iobject = [
  { name: 'Статус 1', value: 0 },
  { name: 'Статус 2', value: 1 },
  { name: 'Статус 3', value: 2 },
]

export const addCompany: Iobject = []

export const addContacts: Iobject = []
