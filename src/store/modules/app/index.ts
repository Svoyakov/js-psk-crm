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
    loader: false,
  },
  actions: {
    setState: ({ commit }: Iobject, payload: Iobject): void => commit('SET_STATE', payload),
    setRouteData: ({ commit }: Iobject, payload: Iobject): void => commit('SET_ROUTE_DATA', payload),
    setCanbanData: ({ commit }: Iobject, payload: Iobject): void => commit('SET_CANBAN_DATA', payload),
    setCanbanOrder: ({ commit }: Iobject, payload: Iobject): void => commit('SET_CANBAN_ORDER', payload),
    setCanbanDeal: ({ commit }: Iobject, payload: Iobject): void => commit('SET_CANBAN_DEAL', payload),
    setUser: ({ commit }: Iobject, payload: Iobject): void => commit('SET_USER', payload),
    setLoader: ({ commit }: Iobject, payload: Iobject): void => commit('SET_LOADER', payload),
  },
  mutations: {
    SET_STATE: (state: Iobject, payload: Iobject): void => { state.state = payload.data },
    SET_ROUTE_DATA: (state: Iobject, payload: Iobject): void => { state.routeData = payload.data },
    SET_CANBAN_DATA: (state: Iobject, payload: Iobject): void => { state.canbanData = payload.data },
    SET_CANBAN_ORDER: (state: Iobject, payload: Iobject): void => { state.canbanOrder = payload.data },
    SET_CANBAN_DEAL: (state: Iobject, payload: Iobject): void => { state.canbanDeal = payload.data },
    SET_USER: (state: Iobject, payload: Iobject): void => { state.user = payload.data },
    SET_LOADER: (state: Iobject, payload: Iobject): void => { state.loader = payload.data },
  },
  getters: {
    getState: (state: Iobject): string => state.state,
    getRouteData: (state: Iobject): string => state.routeData,
    getCanbanData: (state: Iobject): string => state.canbanData,
    getCanbanOrder: (state: Iobject): string => state.canbanOrder,
    getCanbanDeal: (state: Iobject): string => state.canbanDeal,
    getUser: (state: Iobject): string => state.user,
    getLoader: (state: Iobject): string => state.loader,
  },
}
