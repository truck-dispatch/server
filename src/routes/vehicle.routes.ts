import VehicleController from '@controllers/VehicleController'
import multerInstance from '@helpers/multerInstance'
import JWTMiddlewares from '@middlewares/JWTMiddlewares'
import VehicleMiddlewares from '@middlewares/VehicleMiddlewares'
import { Router } from 'express'

const router = Router()

router.post(
  '/',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  multerInstance.fields([
    { name: 'images.frontView', maxCount: 1 },
    { name: 'images.backView', maxCount: 1 },
    { name: 'images.leftSideView', maxCount: 1 },
    { name: 'images.rightSideView', maxCount: 1 },
    { name: 'images.driversCockPit', maxCount: 1 },
    { name: 'images.backInnerView', maxCount: 1 },
    { name: 'driver.avatar', maxCount: 1 },
    { name: 'driver.driverLicense', maxCount: 1 },
  ]),
  VehicleMiddlewares.checkDataForCreateVehicle,
  VehicleController.createVehicle
)

router.get(
  '/',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  VehicleController.getVehicles
)

router.patch(
  '/:vehicleId',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  VehicleMiddlewares.checkIfVehicleExists,
  multerInstance.fields([
    { name: 'driver.avatar', maxCount: 1 },
    { name: 'driver.driverLicense', maxCount: 1 },
  ]),
  VehicleController.updateVehicle
)

export default router
