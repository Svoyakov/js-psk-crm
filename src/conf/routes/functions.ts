interface Iobject {
    [key: string]: any
}

const addPropDefaults = (properties: Iobject, data: Iobject): void => {
  Object.keys(properties).forEach((item: string) => {
    const itemName = properties[item].name
    if (typeof data[itemName] === 'undefined') {
      data[itemName] = properties[item].default
    }
  })
  if (typeof data.children !== 'undefined') {
    data.children.forEach((child: Iobject) => {
      addPropDefaults(properties, child)
    })
  }
}

export default addPropDefaults
