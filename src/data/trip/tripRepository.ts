import countDocuments from '@data/paginate'
import PopulatedTrip from '@interfaces/PopulatedTrip'
import NewTrip from 'interfaces/NewTrip'
import Trip from 'interfaces/Trip'
import { TripModel } from './TripModel'

export async function createTrip(trip: NewTrip) {
  const data = new TripModel(trip)
  await data.save()
  return data
}

export async function findTripBy(
  param: Partial<Trip>
): Promise<PopulatedTrip | null> {
  const trip = await TripModel.findOne(param)
    .populate('transporter', '-password')
    .populate('tripOwner', '-password')
    .populate('paymentRequest')
    .populate('acceptedBid')

  if (!trip) {
    return null
  }

  return trip.toObject()
}

export async function findTripsBy(
  query: Partial<Trip>,
  pageParam = '1',
  limitParam = '10'
) {
  const page = pageParam ? parseInt(pageParam) : 1
  const limit = limitParam ? parseInt(limitParam) : 10

  const data = await TripModel.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('transporter', '-password')
    .populate('tripOwner', '-password')
    .populate('paymentRequest')
    .populate('acceptedBid')

  const countedData = await countDocuments<PopulatedTrip>(
    // @ts-ignore
    TripModel,
    query,
    pageParam,
    limitParam
  )

  return { ...countedData, data }
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
): Promise<PopulatedTrip | null> {
  const updatedTrip = await TripModel.findOneAndUpdate(searchParam, data, {
    new: true,
  })
    .populate('acceptedBid')
    .populate('transporter', '-password')
    .populate('tripOwner', '-password')
    .populate('paymentRequest')
    .populate('acceptedBid')

  if (!updatedTrip) return null

  return updatedTrip as unknown as PopulatedTrip
}

export async function deleteTrip(tripId: string) {
  return TripModel.deleteOne({ _id: tripId })
}
