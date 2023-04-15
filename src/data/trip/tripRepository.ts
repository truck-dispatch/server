import NewTrip from '../../types/NewTrip'
import Trip from '../../types/Trip'
import { findUserBy } from '../user/userRepository'
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
    trips.map(async (trip) => await getCompleteTripDetail(trip))
  )

  return tripsWithResponsibleUsers
}

export async function findAndUpdateTripBy(
  searchParam: Partial<Trip>,
  data: Partial<Trip>
) {
  const updatedTrip = await TripModel.findOneAndUpdate(searchParam, data, {
    new: true,
  }).lean()

  if (!updatedTrip) return updatedTrip

  return getCompleteTripDetail(updatedTrip)
}

async function getCompleteTripDetail(trip: Trip) {
  if (!trip.transporterId) return trip

  const transporter = await findUserBy({ _id: trip.transporterId })
  const tripOwner = await findUserBy({ _id: trip.tripOwner })
  return {
    ...trip,
    transporter,
    tripOwner,
  }
}
