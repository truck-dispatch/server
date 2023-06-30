import Vehicle from '@interfaces/Vehicle'
import { VehicleModel } from './VehicleModel'
import countDocuments from '@data/paginate'

export function createVehicle(data: Vehicle) {
  const vehicle = new VehicleModel(data)
  return vehicle.save()
}

export function findVehicleBy(data: Partial<Vehicle>) {
  return VehicleModel.findOne(data).lean()
}

export async function findVehiclesBy(
  query: Partial<Vehicle>,
  pageParam = '1',
  limitParam = '10'
) {
  const page = pageParam ? parseInt(pageParam) : 1
  const limit = limitParam ? parseInt(limitParam) : 10

  const data = await VehicleModel.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  const countedData = await countDocuments<Vehicle>(
    // @ts-ignore
    VehicleModel,
    query,
    pageParam,
    limitParam
  )
  return { ...countedData, data }
}

export function findAndUpdateVehicleBy(
  searchParam: Partial<Vehicle>,
  data: Partial<Vehicle>
) {
  return VehicleModel.findOneAndUpdate(searchParam, data, { new: true })
}

export function deleteVehicleBy(searchParam: Partial<Vehicle>) {
  return VehicleModel.deleteOne(searchParam)
}
