import { Router } from 'express'
import TripController from '@controllers/TripController'
import multerInstance from '@helpers/multerInstance'
import JwtMiddlewares from '@middlewares/JWTMiddlewares'
import TripMiddlewares from '@middlewares/TripMiddlewares'

const router = Router()

router.post(
  '/',
  JwtMiddlewares.jwtIsValid,
  JwtMiddlewares.checkisClientBasedUserType,
  TripMiddlewares.canCreateTrip,
  TripController.createTrip
)
router.get('/', JwtMiddlewares.jwtIsValid, TripController.getTrips)
router.get(
  '/jobs',
  JwtMiddlewares.jwtIsValid,
  JwtMiddlewares.checkIsServiceBasedUserType,
  TripController.getJobs
)
router.get(
  '/:tripId',
  JwtMiddlewares.jwtIsValid,
  TripMiddlewares.checkIfUserIsAssociatedToTrip,
  TripController.getTrip
)
router.patch(
  '/:tripId',
  JwtMiddlewares.jwtIsValid,
  JwtMiddlewares.checkisClientBasedUserType,
  TripMiddlewares.isTripCreator,
  TripController.updateTrip
)

router.patch(
  '/:tripId/change-status/:status',
  JwtMiddlewares.jwtIsValid,
  JwtMiddlewares.checkIsServiceBasedUserType,
  TripMiddlewares.isTripTransporter,
  TripMiddlewares.checkIfStatusChangeIsAccepted,
  TripController.changeTripStatus
)

router.post(
  '/:tripId/assign-trip',
  JwtMiddlewares.jwtIsValid,
  JwtMiddlewares.checkisClientBasedUserType,
  TripMiddlewares.isTripCreator,
  TripMiddlewares.checkDataForTripAssignmentIsComplete,
  TripController.assignTrip
)
router.post(
  '/:tripId/upload-tdo',
  JwtMiddlewares.jwtIsValid,
  JwtMiddlewares.checkisClientBasedUserType,
  TripMiddlewares.isTripCreator,
  multerInstance.fields([{ name: 'TDO', maxCount: 1 }]),
  TripController.uploadTDO
)
export default router
