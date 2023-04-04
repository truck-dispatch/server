import NewTrip from '../../../types/NewTrip'
import Trip from '../../../types/Trip'
import { findUserBy } from '../User/user.repository'
import { TripModel } from './TripModel'

export async function createTrip(trip: NewTrip) {
  const data = new TripModel(trip)
  await data.save()
  return data
}
export async function findTripBy(param: Partial<Trip>): Promise<Trip | null> {
  const trip = await TripModel.findOne(param)
  if (!trip) {
    return null
  }

  return trip.toObject()
}

export async function findTripsBy(param: Partial<Trip>) {
  const trips = await TripModel.find(param).lean()

  const tripsWithResponsibleUsers = await Promise.all(
    trips.map(async (trip) => {
      if (!trip.transporterId) return trip

      const transporter = await findUserBy({ _id: trip.transporterId })
      const tripOwner = await findUserBy({ _id: trip.tripOwner })
      return {
        ...trip,
        transporter,
        tripOwner,
      }
    })
  )

  return tripsWithResponsibleUsers
}

export function findAndUpdateTripBy(
  searchParam: Partial<Trip>,
  data: Partial<Trip>
) {
  return TripModel.findOneAndUpdate(searchParam, data, { new: true })
}
