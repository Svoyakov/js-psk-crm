interface Iobject {
    [key: string]: any
  }

export const addingInit: Iobject = {
  company: {
    id: -1,
    companyName: '',
    companyType: '',
    info: '',
    phones: [],
    emails: [],
    sites: [],
  },
  contacts: {
    id: -1,
    company: '',
    firstName: '',
    middleName: '',
    lastName: '',
    position: '',
    department: '',
    info: '',
    phones: [],
    emails: [],
    messengers: [],
  },
  phones: { phone: '', info: '' },
  emails: { email: '', info: '' },
  sites: { site: '', info: '' },
  messengers: { messenger: '', info: '' },
}

export const board: Iobject = {
  company: { 
    data: [addingInit.company], 
  },
  contacts: { 
    data: [addingInit.contacts], 
  },
}

export const companyContactsPhrases: Iobject = {
  companyType: 'Форма собственности',
  companyName: 'Название компании',
  firstName: 'Имя',
  middleName: 'Отчество',
  lastName: 'Фамилия',
  position: 'Должность',
  department: 'Отдел',
  info: 'Дополнительная информация',
  company: 'Компания',
}
