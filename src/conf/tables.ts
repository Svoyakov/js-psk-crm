interface Iobject {
    [key: string]: any
}

const tablePrefix = 'th_4g5_'

const tables: Iobject = {
  canbanOrder: `${tablePrefix}canbanOrder`,
  canbanData: `${tablePrefix}canbanDeals`,
  canbanHistory: `${tablePrefix}canbanHistory`,
}

const dispatchByTable: Iobject = {
  [`${tablePrefix}canbanDeals`]: 'app/setCanbanData',
  [`${tablePrefix}canbanOrder`]: 'app/setCanbanOrder',
}

const jsonParseKeys: Iobject = {
  history: true,
  contacts: true,
  'deal.additions.windows': true,
  'deal.additions.innerDoors': true,
  'deal.additions.gates': true,
  'deal.additions.cranes': true,
  'company.contacts': true,
}

export { tables, dispatchByTable, jsonParseKeys }
