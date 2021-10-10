import addPropDefaults from '@/conf/routes/functions'
import p from '@/conf/routes/properties'
import addDeal from '@/components/pages/AddDeal.vue'

const { properties } = p

const data: any = {
  path: '/add-deal' as string,
  name: 'add-deal' as string,
  component: addDeal as any,
  [properties.secure.name]: properties.secure.types.on,
  [properties.changeProp.name]: properties.changeProp.types.user,
  [properties.needLoadData.name]: properties.needLoadData.types.off,
}

addPropDefaults(properties, data)
export default data
