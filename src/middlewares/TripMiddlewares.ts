import { NextFunction, Request, Response } from 'express'
import { clientUserTypes } from '../common/constants'
import { findTripBy } from '../data/models/Trip/trip.repository'
import Respond from '../helpers/Respond'
import { getUserFromReq } from '../services/JWT'

class TripMiddlewares {
  canCreateTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        pickUpAddress,
        deliveryAddress,
        pickUpDate,
        deliveryDate,
        typeOfGoods,
        weight,
        sizeOfContainer,
        shippingLine,
        jobType,
      } = req.body

      if (
        !pickUpAddress ||
        !deliveryAddress ||
        !pickUpDate ||
        !deliveryDate ||
        !typeOfGoods ||
        !weight
      ) {
        return Respond.error(
          res,
          'pickUpAddress, deliveryAddress, pickUpDate, deliveryDate, typeOfGoods, weight are compulsory fields.'
        )
      }

      if (
        typeOfGoods === 'container' &&
        (!sizeOfContainer || !shippingLine || !jobType)
      ) {
        return Respond.error(
          res,
          'sizeOfContainer, shippingLine, and jobType are compulsory fields.'
        )
      }

      next()
    } catch (err) {
      Respond.error(res, (err as Error).message)
    }
  }

  async isTripCreator(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserFromReq(req)
      const { tripId } = req.params

      if (!tripId) return Respond.error(res, 'Trip ID was not provided', 400)

      const trip = await findTripBy({ _id: tripId })

      if (trip?.tripOwner !== user._id)
        return Respond.error(
          res,
          'Only the trip owner has the right to update this trip'
        )

      next()
    } catch (err) {
      // Report error to our client..
      console.log(err)
      Respond.error(res, (err as Error).message)
    }
  }

  async tripExists(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params

      if (!tripId) return Respond.error(res, 'Trip Id was not provided')

      const trip = await findTripBy({ _id: tripId })
      if (!trip) return Respond.error(res, 'Trip does not exist', 404)

      next()
    } catch (err) {
      Respond.error(res, (err as Error).message)
    }
  }
}

export default new TripMiddlewares()
