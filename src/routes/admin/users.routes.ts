import { Router } from 'express'

import UserController from '@controllers/Admin/UserController'

const router = Router()

router.get('/users', UserController.getUsers)
