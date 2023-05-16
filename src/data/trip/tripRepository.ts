import paginate from '@data/paginate'
import NewTrip from 'interfaces/NewTrip'
import Trip from 'interfaces/Trip'
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

export async function findTripsBy(
  query: Partial<Trip>,
  page?: string,
  limit?: string
) {
  const paginatedData = await paginate<Trip>(TripModel, query, page, limit)

  const tripsWithResponsibleUsers = await Promise.all(
    paginatedData.data.map(async (trip) => await getCompleteTripDetail(trip))
  )

  return { ...paginatedData, data: tripsWithResponsibleUsers }
}

export async function getAvailableJobNumbers() {
  const totalItems = await TripModel.countDocuments({ status: 'awaiting-bid' })
  const byCompany = await TripModel.countDocuments({
    tripOwnerUserType: 'company',
    status: 'awaiting-bid',
  })
  const byShipper = await TripModel.countDocuments({
    tripOwnerUserType: 'shipper',
    status: 'awaiting_bid',
  })

  return { totalItems, byCompany, byShipper }
}

export async function getTripNumbers(param: Partial<Trip>) {
  const totalItems = await TripModel.countDocuments(param)
  const pending = await TripModel.countDocuments({
    ...param,
    status: 'awaiting-bid',
  })
  const inProgress = await TripModel.countDocuments({
    ...param,
    status: 'in-progress',
  })
  const completed = await TripModel.countDocuments({
    ...param,
    status: 'completed',
  })

  return { totalItems, pending, inProgress, completed }
}

export async function findAndUpdateTripBy(
  searchParam: Partial<Trip>,
  data: Partial<Trip>
) {
  const updatedTrip = await TripModel.findOneAndUpdate(searchParam, data, {
    new: true,
  }).lean()

  if (!updatedTrip) return updatedTrip

  return getCompleteTripDetail(updatedTrip) as unknown as Trip
}

export async function getCompleteTripDetail(trip: Trip) {
  const transporter = await findUserBy({ _id: trip.transporterId })
  const tripOwner = await findUserBy({ _id: trip.tripOwner })

  const data: Record<string, unknown> = { ...trip, tripOwner }

  if (transporter) data.transporter = transporter
  return {
    ...trip,
    transporter,
    tripOwner,
  }
}
