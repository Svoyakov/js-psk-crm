import addPropDefaults from '@/conf/routes/functions'
import p from '@/conf/routes/properties'
import Auth from '@/components/pages/Auth.vue'

const { properties } = p

const data: any = {
  path: '/auth' as string,
  name: 'auth' as string,
  component: Auth as any,
}

addPropDefaults(properties, data)
export default data
