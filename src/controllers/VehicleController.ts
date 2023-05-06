import { createVehicle, findVehiclesBy } from '@data/vehicle/vehicleRepository'
import { Helpers } from '@helpers/index'
import Respond from '@helpers/Respond'
import Vehicle from '@interfaces/Vehicle'
import Cloudinary from '@services/Cloudinary'
import { getUserCredentialsFromReq } from '@services/JWT'
import { NextFunction, Request, Response } from 'express'

class VehicleController {
  async createVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await extractData(req)
      const { _id } = getUserCredentialsFromReq(req)
      const vehicle = await createVehicle({ ...data, ownerId: _id })

      return Respond.success(res, 'vehicle created successfully', vehicle)
    } catch (err) {
      next(err)
    }
  }

  async getVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = getUserCredentialsFromReq(req)

      const vehicles = await findVehiclesBy({ ownerId: _id })

      return Respond.success(res, 'Vehicles fetched successfully', vehicles)
    } catch (err) {
      next(err)
    }
  }
}

export default new VehicleController()

async function extractData(req: Request): Promise<Vehicle> {
  const { plateNumber, vehicleType } = req.body
  const rawFrontView = Helpers.extractFileFromReq(req, 'images.frontView')
  const rawBackView = Helpers.extractFileFromReq(req, 'images.backView')
  const rawLeftSideView = Helpers.extractFileFromReq(req, 'images.leftSideView')
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

  const frontView = await Cloudinary.upload({ file: rawFrontView })
  const backView = await Cloudinary.upload({ file: rawBackView })
  const leftSideView = await Cloudinary.upload({ file: rawLeftSideView })
  const rightSideView = await Cloudinary.upload({ file: rawRightSideView })
  const driversCockPit = await Cloudinary.upload({ file: rawDriversCockPit })
  const backInnerView = await Cloudinary.upload({ file: rawBackInnerView })
  const driverLicense = await Cloudinary.upload({ file: rawDriverLicense })
  const avatar = await Cloudinary.upload({ file: rawAvatar })

  return {
    ownerId: '',
    plateNumber,
    vehicleType,
    images: {
      frontView,
      backView,
      leftSideView,
      rightSideView,
      driversCockPit,
      backInnerView,
    },
    driver: {
      name: req.body['driver.name'],
      phone: req.body['driver.phone'],
      avatar,
      driverLicense,
    },
  }
}
