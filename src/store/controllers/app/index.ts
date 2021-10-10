interface Iobject {
  [key: string]: any
}

export default function appController(): any {
  return (store: Iobject) => {
    store.subscribe((mutation: Iobject): void => {
      switch (mutation.type) {
        case 'app/SET_STATE':
          console.log(mutation)
          break

        case 'app/SET_ROUTE_DATA':
          console.log(mutation)
          break

        case 'app/SET_CANBAN_DEAL':
          console.log(mutation)
          break

        case 'app/SET_CANBAN_DATA':
          console.log(mutation)
          break

        case 'app/SET_CANBAN_ORDER':
          console.log(mutation)
          break

        case 'app/SET_LOADER':
          console.log(mutation)
          break

        default:

          break
      }
    })
  }
}
