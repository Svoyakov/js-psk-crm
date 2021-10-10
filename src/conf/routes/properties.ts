interface Iobject {
  [key: string]: any
}

const types: Iobject = {
  on: true,
  off: false,
  auth: 'onlyAuthorized',

  user: 'onlyUser',
  userAndChief: 'userAndChief',
  all: 'all',
}

const properties: Iobject = {
  secure: {
    name: 'secure',
    describe: 'Авторизован ли пользователь для входа',
    types: {
      on: types.auth,
      off: types.off,
    },
    default: types.off,
  },
  changeProp: {
    name: 'changeProp',
    describe: 'Возможность измнения данных',
    types: {
      user: types.user,
      userAndChief: types.userAndChief,
      all: types.all,
      off: types.off,
    },
    default: types.off,
  },
  needLoadData: {
    name: 'needLoadData',
    describe: 'Необходимость загрузки данных',
    types: {
      on: types.on,
      off: types.off,
    },
    default: types.off,
  },
}

export default { properties, types }
