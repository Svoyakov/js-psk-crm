import addPropDefaults from '@/conf/routes/functions'
import p from '@/conf/routes/properties'
import CanbanDeal from '@/components/pages/CanbanDealPage.vue'
import Canban from '@/components/pages/CanbanPage.vue'

const { properties } = p

const data: any = {
  path: '/canban' as string,
  name: 'canban' as string,
  component: Canban as any,
  [properties.secure.name]: properties.secure.types.on,
  [properties.changeProp.name]: properties.changeProp.types.user,
  [properties.needLoadData.name]: properties.needLoadData.types.on,
  children: [
    {
      path: 'deal/:id' as string,
      name: 'canbanDeal' as string,
      component: CanbanDeal as any,
      [properties.secure.name]: properties.secure.types.on,
      [properties.needLoadData.name]: properties.needLoadData.types.on,
    },
  ],
}

addPropDefaults(properties, data)
export default data
