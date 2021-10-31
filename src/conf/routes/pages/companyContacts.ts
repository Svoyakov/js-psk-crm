import addPropDefaults from '@/conf/routes/functions'
import p from '@/conf/routes/properties'
import CompanyContacts from '@/components/pages/CompanyContacts.vue'

const { properties } = p

const data: any = {
  path: '/add-company-contacts' as string,
  name: 'addEditCompanyContacts' as string,
  component: CompanyContacts as any,
}

addPropDefaults(properties, data)
export default data
