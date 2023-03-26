import NewTrip from '../../../types/NewTrip'
import Trip from '../../../types/Trip'
import { TripSchema } from './trip.model'

export async function createTrip(trip: NewTrip) {
  const data = new TripSchema(trip)
  await data.save()
  return data
}
export async function updateTrip(
  searchParam: Partial<Trip>,
  data: Partial<Trip>
) {
  return TripSchema.findOneAndUpdate(searchParam, data, { new: true })
}

export async function findTripBy(param: Partial<Trip>): Promise<Trip | null> {
  const trip = await TripSchema.findOne(param)
  if (!trip) {
    return null
  }

  return trip.toObject()
}

export async function findTripsBy(param: Partial<Trip>) {
  return TripSchema.find(param)
}

export function findAndUpdateTripBy(
  searchParam: Partial<Trip>,
  data: Partial<Trip>
) {
  return TripSchema.findOneAndUpdate(searchParam, data, { new: true })
}
