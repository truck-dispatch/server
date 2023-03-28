import NewTrip from '../../../types/NewTrip'
import Trip from '../../../types/Trip'
import { TripModel } from './TripModel'

export async function createTrip(trip: NewTrip) {
  const data = new TripModel(trip)
  await data.save()
  return data
}
export async function updateTrip(
  searchParam: Partial<Trip>,
  data: Partial<Trip>
) {
  return TripModel.findOneAndUpdate(searchParam, data, { new: true })
}

export async function findTripBy(param: Partial<Trip>): Promise<Trip | null> {
  const trip = await TripModel.findOne(param)
  if (!trip) {
    return null
  }

  return trip.toObject()
}

export async function findTripsBy(param: Partial<Trip>) {
  return TripModel.find(param)
}

export function findAndUpdateTripBy(
  searchParam: Partial<Trip>,
  data: Partial<Trip>
) {
  return TripModel.findOneAndUpdate(searchParam, data, { new: true })
}
