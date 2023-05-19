import { findTripBy, findTripsBy } from '@data/trip/tripRepository'
import Bid from 'interfaces/Bid'
import { findUserBy } from '../user/userRepository'
import { BidModel } from './BidModel'

interface CreateBidBody extends Omit<Bid, '_id'> {
  _id?: string
}
export function createBid(bid: CreateBidBody) {
  const data = new BidModel(bid)
  return data.save()
}

export function findAndUpdateBidBy(
  searchParam: Partial<Bid>,
  data: Partial<Bid>
) {
  return BidModel.findOneAndUpdate(searchParam, data, { new: true })
}

export async function findBidBy(
  searchParam: Partial<Bid>
): Promise<Bid | null> {
  const data = await BidModel.findOne(searchParam).lean()
  if (!data) return null
  return data
}

export async function findBidsBy(searchParam: Partial<Bid>) {
  const bids = await BidModel.find(searchParam).lean()
  const bidsWithTransporters = await Promise.all(
    bids.map(async (bid) => {
      const transporter = await findUserBy({ _id: bid.transporterId })
      return {
        ...bid,
        transporter,
      }
    })
  )
  return bidsWithTransporters
}
export async function findActiveBidsBy(searchParam: Partial<Bid>) {
  const bids = await BidModel.find(searchParam).lean()
  const activeBids = await Promise.all(
    bids.filter(async (bid) => {
      const trip = await findTripBy({ _id: bid.tripId })
      return !!trip && trip.status !== 'awaiting-bid'
    })
  )
  return activeBids
}
