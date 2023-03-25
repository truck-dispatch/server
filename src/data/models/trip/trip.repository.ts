import NewTrip from '../../../types/NewTrip'
import Trip from '../../../types/Trip'
import { TripSchema } from './trip.model'

export async function createTrip(user: NewTrip) {
  const data = new TripSchema(user)
  await data.save()
  return data
}

export async function findTripBy(param: Partial<Trip>): Promise<Trip | null> {
  const trip = await TripSchema.findOne(param)
  if (!trip) {
    return null
  }

  return trip.toObject()
}

export function findAndUpdateTripBy(
  searchParam: Partial<Trip>,
  data: Partial<Trip>
) {
  return TripSchema.findOneAndUpdate(searchParam, data, { new: true })
}
