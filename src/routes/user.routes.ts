import { Router } from 'express'
import userController from '../controllers/user.controller'
import jwtMiddlewares from '../middlewares/jwt.middlewares'

const router = Router()

router.get('/', jwtMiddlewares.jwtIsValid, userController.getUser)

export default router
