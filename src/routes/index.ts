import main from '@/conf/routes/pages/main'
import canban from '@/conf/routes/pages/canban'
import addEditDeal from '@/conf/routes/pages/addEditDeal'
import error from '@/conf/routes/pages/error'
import auth from '@/conf/routes/pages/auth'
import companyContacts from '@/conf/routes/pages/companyContacts'

const routes: any = [
  main,
  canban,
  ...addEditDeal,
  error,
  auth,
  companyContacts,
]

export default routes
