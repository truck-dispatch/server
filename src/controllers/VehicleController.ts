import {
  createVehicle,
  findAndUpdateVehicleBy,
  findVehicleBy,
  findVehiclesBy,
} from '@data/vehicle/vehicleRepository'
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
      const vehicle = await createVehicle({ ...data, owner: _id })

      return Respond.success(res, 'vehicle created successfully', vehicle)
    } catch (err) {
      next(err)
    }
  }

  async getVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = getUserCredentialsFromReq(req)

      const vehicles = await findVehiclesBy({ owner: _id })

      return Respond.success(res, 'Vehicles fetched successfully', vehicles)
    } catch (err) {
      next(err)
    }
  }

  async updateVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedData = await extractData(req)
      const { vehicleId } = req.params

      const unupdatedVehicleData = await findVehicleBy({ _id: vehicleId })

      const vehicleUpdateResponse = await findAndUpdateVehicleBy(
        { _id: vehicleId },
        {
          ...unupdatedVehicleData,
          ...updatedData,
          images: unupdatedVehicleData?.images!,
          driver: {
            ...unupdatedVehicleData?.driver!,
            ...updatedData.driver,
          },
        }
      )

      return Respond.success(res, 'Vehicle Updated', vehicleUpdateResponse)
    } catch (err) {
      next(err)
    }
  }
}

export default new VehicleController()

function fileIsAvailableForUpload(file: File | string) {
  if (!file || typeof file === 'string') return false

  return true
}

async function extractData(req: Request): Promise<Vehicle> {
  const { plateNumber, vehicleType } = req.body
  const data = {
    images: {},
    driver: {},
  } as Vehicle
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

  if (fileIsAvailableForUpload(rawFrontView))
    data.images.frontView = await Cloudinary.upload({ file: rawFrontView })
  if (fileIsAvailableForUpload(rawBackView))
    data.images.backView = await Cloudinary.upload({ file: rawBackView })
  if (fileIsAvailableForUpload(rawLeftSideView))
    data.images.leftSideView = await Cloudinary.upload({
      file: rawLeftSideView,
    })
  if (fileIsAvailableForUpload(rawRightSideView))
    data.images.rightSideView = await Cloudinary.upload({
      file: rawRightSideView,
    })
  if (fileIsAvailableForUpload(rawDriversCockPit))
    data.images.driversCockPit = await Cloudinary.upload({
      file: rawDriversCockPit,
    })
  if (fileIsAvailableForUpload(rawBackInnerView))
    data.images.backInnerView = await Cloudinary.upload({
      file: rawBackInnerView,
    })
  if (fileIsAvailableForUpload(rawDriverLicense))
    data.driver.driverLicense = await Cloudinary.upload({
      file: rawDriverLicense,
    })
  if (fileIsAvailableForUpload(rawAvatar))
    data.driver.avatar = await Cloudinary.upload({ file: rawAvatar })

  if (plateNumber) data.plateNumber = plateNumber
  if (vehicleType) data.vehicleType = vehicleType
  if (req.body['driver.name']) data.driver.name = req.body['driver.name']
  if (req.body['driver.phone']) data.driver.phone = req.body['driver.phone']

  return data
}
