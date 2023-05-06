import { Helpers } from '@helpers/index'
import Respond from '@helpers/Respond'
import { NextFunction, Request, Response } from 'express'

class VehicleMiddlewares {
  checkDataForCreateVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { plateNumber, vehicleType } = req.body

      const rawFrontView = Helpers.extractFileFromReq(req, 'images.frontView')
      const rawBackView = Helpers.extractFileFromReq(req, 'images.backView')
      const rawLeftSideView = Helpers.extractFileFromReq(
        req,
        'images.leftSideView'
      )
      const rawRightSideView = Helpers.extractFileFromReq(
        req,
        'images.rightSideView'
      )
      const rawDriversCockPit = Helpers.extractFileFromReq(
        req,
        'images.driversCockPit'
      )
      const rawBackInnerView = Helpers.extractFileFromReq(
        req,
        'images.backInnerView'
      )
      const rawDriverLicense = Helpers.extractFileFromReq(
        req,
        'driver.driverLicense'
      )
      const rawAvatar = Helpers.extractFileFromReq(req, 'driver.avatar')

      if (!plateNumber || !vehicleType)
        return Respond.error(
          res,
          'Plate Number and vehicleType are compulsory fields'
        )

      if (!rawAvatar || !rawDriverLicense)
        return Respond.error(
          res,
          'Driver avatar or driver license seems to be missing.'
        )

      if (
        !rawBackInnerView ||
        !rawBackView ||
        !rawRightSideView ||
        !rawDriversCockPit ||
        !rawFrontView ||
        !rawLeftSideView
      )
        return Respond.error(
          res,
          `backInnerView or BackView or RightSideView or DriversCockPit or FrontView or LeftSideView seems to be missing`
        )
      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message, 500)
    }
  }
}

export default new VehicleMiddlewares()
