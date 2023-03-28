import { Router } from 'express'
import UserController from '../controllers/UserController'
import JWTMiddlewares from '../middlewares/JWTMiddlewares'

const router = Router()

router.get('/', JWTMiddlewares.jwtIsValid, UserController.getUser)

export default router
