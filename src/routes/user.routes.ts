import { Router } from 'express'
import UserController from '../controllers/UserController'
import JWTMiddlewares from '../middlewares/JWTMiddlewares'

const router = Router()

router.get('/', JWTMiddlewares.jwtIsValid, UserController.getUser)
router.post('/bank-details', JWTMiddlewares.jwtIsValid, UserController.addAccount)

export default router
