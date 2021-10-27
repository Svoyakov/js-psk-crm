interface Iobject {
    [key: string]: any
}

export const canbanStages: Iobject = [
  { name: 'Первый контакт' },
  { name: 'Отправка КП' },
  { name: 'Переговоры' },
  { name: 'Принимают решение' },
  { name: 'Согласование договора' },
  { name: 'Оплата аванса' },
  { name: 'Исполнение' },
  { name: 'Окончательный расчет' },
]

export const catId = 1
