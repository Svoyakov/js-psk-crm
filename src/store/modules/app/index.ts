interface Iobject {
  [key: string]: any
}

export default {
  namespaced: true,
  app: {},
  state: {
    state: null,
    routeData: null,
    canbanData: null,
    canbanOrder: [],
    canbanDeal: [],
    user: null,
    users: null,
    loader: false,
    datetimeCorrect: null,
    popupDialog: null,
  },
  actions: {
    setState: ({ commit }: Iobject, payload: Iobject): void => commit('SET_STATE', payload),
    setRouteData: ({ commit }: Iobject, payload: Iobject): void => commit('SET_ROUTE_DATA', payload),
    setCanbanData: ({ commit }: Iobject, payload: Iobject): void => commit('SET_CANBAN_DATA', payload),
    setCanbanOrder: ({ commit }: Iobject, payload: Iobject): void => commit('SET_CANBAN_ORDER', payload),
    setCanbanDeal: ({ commit }: Iobject, payload: Iobject): void => commit('SET_CANBAN_DEAL', payload),
    setUser: ({ commit }: Iobject, payload: Iobject): void => commit('SET_USER', payload),
    setUsers: ({ commit }: Iobject, payload: Iobject): void => commit('SET_USERS', payload),
    setLoader: ({ commit }: Iobject, payload: Iobject): void => commit('SET_LOADER', payload),
    setDatetimeCorrect: ({ commit }: Iobject, payload: Iobject): void => commit('SET_DATETIME_CORRECT', payload),
    setPopupDialog: ({ commit }: Iobject, payload: Iobject): void => commit('SET_POPUP_DIALOG', payload),
  },
  mutations: {
    SET_STATE: (state: Iobject, payload: Iobject): void => { state.state = payload.data },
    SET_ROUTE_DATA: (state: Iobject, payload: Iobject): void => { state.routeData = payload.data },
    SET_CANBAN_DATA: (state: Iobject, payload: Iobject): void => { state.canbanData = payload.data },
    SET_CANBAN_ORDER: (state: Iobject, payload: Iobject): void => { state.canbanOrder = payload.data },
    SET_CANBAN_DEAL: (state: Iobject, payload: Iobject): void => { state.canbanDeal = payload.data },
    SET_USER: (state: Iobject, payload: Iobject): void => { state.user = payload.data },
    SET_USERS: (state: Iobject, payload: Iobject): void => { state.users = payload.data },
    SET_LOADER: (state: Iobject, payload: Iobject): void => { state.loader = payload.data },
    SET_DATETIME_CORRECT: (state: Iobject, payload: Iobject): void => { state.datetimeCorrect = payload.data },
    SET_POPUP_DIALOG: (state: Iobject, payload: Iobject): void => { state.popupDialog = payload.data },
  },
  getters: {
    getState: (state: Iobject): string => state.state,
    getRouteData: (state: Iobject): string => state.routeData,
    getCanbanData: (state: Iobject): string => state.canbanData,
    getCanbanOrder: (state: Iobject): string => state.canbanOrder,
    getCanbanDeal: (state: Iobject): string => state.canbanDeal,
    getUser: (state: Iobject): string => state.user,
    getUsers: (state: Iobject): string => state.users,
    getLoader: (state: Iobject): string => state.loader,
    getDatetimeCorrect: (state: Iobject): string => state.datetimeCorrect,
    getPopupDialog: (state: Iobject): string => state.popupDialog,
  },
}
