import Vehicle from '@interfaces/Vehicle'
import { VehicleModel } from './VehicleModel'

export function createVehicle(data: Vehicle) {
  const vehicle = new VehicleModel(data)
  return vehicle.save()
}
