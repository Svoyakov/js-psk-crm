import addPropDefaults from '@/conf/routes/functions'
import p from '@/conf/routes/properties'
import AddEditDeal from '@/components/pages/AddEditDeal.vue'

const { properties } = p

const addDeal: any = {
  path: '/add-deal' as string,
  name: 'addDeal' as string,
  component: AddEditDeal as any,
  [properties.secure.name]: properties.secure.types.on,
  [properties.changeProp.name]: properties.changeProp.types.user,
  [properties.needLoadData.name]: properties.needLoadData.types.off,
}

const editDeal: any = {
  path: '/edit-deal/:id' as string,
  name: 'editDeal' as string,
  component: AddEditDeal as any,
  [properties.secure.name]: properties.secure.types.on,
  [properties.changeProp.name]: properties.changeProp.types.user,
  [properties.needLoadData.name]: properties.needLoadData.types.off,
}

addPropDefaults(properties, addDeal)
addPropDefaults(properties, editDeal)

export default [addDeal, editDeal]
