import main from '@/conf/routes/pages/main'
import canban from '@/conf/routes/pages/canban'
import addEditDeal from '@/conf/routes/pages/addEditDeal'
import error from '@/conf/routes/pages/error'
import auth from '@/conf/routes/pages/auth'

const routes: any = [
  main,
  canban,
  ...addEditDeal,
  error,
  auth,
]

export default routes
