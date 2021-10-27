interface Iobject {
    [key: string]: any
}

const tablePrefix = ''

const tables: Iobject = {
  canbanOrder: `${tablePrefix}canbanOrder`,
  canbanData: `${tablePrefix}canbanDeals`,
  canbanHistory: `${tablePrefix}canbanHistory`,
  users: `${tablePrefix}users`,
}

const dispatchByTable: Iobject = {
  [`${tablePrefix}canbanDeals`]: 'app/setCanbanData',
  [`${tablePrefix}canbanOrder`]: 'app/setCanbanOrder',
  [`${tablePrefix}users`]: 'app/setUsers',
}

const jsonParseKeys: Iobject = {
  history: true,
  contacts: true,
  'deal.additions.windows': true,
  'deal.additions.doors': true,
  'deal.additions.gates': true,
  'deal.additions.cranes': true,
  'company.contacts': true,
}

export { tables, dispatchByTable, jsonParseKeys }
