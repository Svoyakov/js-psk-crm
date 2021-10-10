import addPropDefaults from '@/conf/routes/functions'
import p from '@/conf/routes/properties'
import ErrorPage from '@/components/pages/ErrorPage.vue'

const { properties } = p

const data: any = {
  path: '*' as string,
  name: 'error' as string,
  component: ErrorPage as any,
}

addPropDefaults(properties, data)
export default data
