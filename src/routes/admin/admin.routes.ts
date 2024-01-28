import { Router } from 'express'
import AdminController from '@controllers/Admin/AdminController'
import JWTMiddlewares from '@middlewares/JWTMiddlewares'

const router = Router()

router.get('/', JWTMiddlewares.checkAdminJwt, AdminController.getAdmin)
router.post('/', JWTMiddlewares.checkIsSuperAdmin, AdminController.addAdmin)
router.get(
  '/admins',
  JWTMiddlewares.checkIsSuperAdmin,
  AdminController.getAdmins
)

export default router
