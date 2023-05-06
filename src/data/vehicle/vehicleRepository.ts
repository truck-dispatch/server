import Vehicle from '@interfaces/Vehicle'
import { VehicleModel } from './VehicleModel'

export function createVehicle(data: Vehicle) {
  const vehicle = new VehicleModel(data)
  return vehicle.save()
}

export function findVehiclesBy(data: Partial<Vehicle>) {
  return VehicleModel.find(data).lean()
}
