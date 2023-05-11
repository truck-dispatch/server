import Vehicle from '@interfaces/Vehicle'
import { VehicleModel } from './VehicleModel'

export function createVehicle(data: Vehicle) {
  const vehicle = new VehicleModel(data)
  return vehicle.save()
}

export function findVehicleBy(data: Partial<Vehicle>) {
  return VehicleModel.findOne(data).lean()
}
export function findVehiclesBy(data: Partial<Vehicle>) {
  return VehicleModel.find(data).lean()
}

export function findAndUpdateVehicleBy(
  searchParam: Partial<Vehicle>,
  data: Partial<Vehicle>
) {
  return VehicleModel.findOneAndUpdate(searchParam, data, { new: true })
}
