import PopulatedBid from '@interfaces/PopulatedBid'
import Bid from 'interfaces/Bid'
import { BidModel } from './BidModel'

interface CreateBidBody extends Omit<Bid, '_id'> {
  _id?: string
}
export async function createBid(bid: CreateBidBody) {
  const data = new BidModel(bid)
  await data.save()

  return data.populate({
    path: 'trip',
    populate: {
      path: 'tripOwner',
      model: 'User',
    },
  })
}

export function deleteBidBy(searchParam: Partial<Bid>) {
  return BidModel.deleteOne(searchParam)
}

export function findAndUpdateBidBy(
  searchParam: Partial<Bid>,
  data: Partial<Bid>
) {
  return BidModel.findOneAndUpdate(searchParam, data, { new: true })
    .populate({
      path: 'trip',
      populate: {
        path: 'tripOwner',
        model: 'User',
      },
    })
    .populate('transporter')
}

export async function findBidBy(
  searchParam: Partial<Bid>
): Promise<PopulatedBid | null> {
  const data = await BidModel.findOne(searchParam)
    .populate({
      path: 'trip',
      populate: {
        path: 'tripOwner',
        model: 'User',
      },
    })
    .populate('transporter')
  if (!data) return null
  return data
}

export async function findBidsBy(searchParam: Partial<Bid>) {
  return BidModel.find(searchParam)
    .populate('transporter')
    .sort({ createdAt: -1 })
    .lean()
}

export async function findActiveBidsBy(searchParam: Partial<Bid>) {
  const bids = await BidModel.find(searchParam).populate({
    path: 'trip',
    populate: {
      path: 'tripOwner',
      model: 'User',
    },
  })
  const activeBids = bids.filter((bid) => {
    return bid?.trip?.status === 'awaiting-bid'
  })
  return activeBids
}

// TODO: find a way to deep query the model to check trip status without needing to use .map;
async function getActiveBidsCopy(searchParam: Partial<Bid>) {
  const activeBids = await BidModel.aggregate([
    {
      $match: searchParam,
    },
    {
      $lookup: {
        from: 'Trip',
        localField: 'trip',
        foreignField: '_id',
        as: 'trip',
      },
    },
    {
      $unwind: '$trip',
    },
    {
      $lookup: {
        from: 'User',
        localField: 'trip.tripOwner',
        foreignField: '_id',
        as: 'trip.tripOwner',
      },
    },
    {
      $unwind: '$trip.tripOwner',
    },
    {
      $match: {
        'trip.status': 'awaiting-bid',
      },
    },
  ])

  return activeBids
}
