import addPropDefaults from '@/conf/routes/functions'
import p from '@/conf/routes/properties'
import Main from '@/components/pages/MainPage.vue'

const { properties } = p

const data: any = {
  path: '/' as string,
  name: 'main' as string,
  component: Main as any,
}

addPropDefaults(properties, data)
export default data
