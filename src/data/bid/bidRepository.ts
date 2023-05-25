import { findTripBy, findTripsBy } from '@data/trip/tripRepository'
import PopulatedBid from '@interfaces/PopulatedBid'
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
  return BidModel.findOneAndUpdate(searchParam, data, { new: true }).populate('trip');
}

export async function findBidBy(
  searchParam: Partial<Bid>
): Promise<PopulatedBid | null> {
  const data = await BidModel.findOne(searchParam).lean()
  if (!data) return null
  return data
}

export async function findBidsBy(searchParam: Partial<Bid>) {
  const bids = await BidModel.find(searchParam).lean()
  const bidsWithTransporters = await Promise.all(
    bids.map(async (bid) => {
      const transporter = await findUserBy({ _id: bid.transporter })
      return {
        ...bid,
        transporter,
      }
    })
  )
  return bidsWithTransporters
}

export async function findActiveBidsBy(searchParam: Partial<Bid>) {
  const bids = await BidModel.find(searchParam).populate({
    path: 'trip',
    populate: {
      path: 'tripOwner',
      model: 'User',
    },
  });
  const activeBids = bids.filter((bid) => {
    return  bid?.trip?.status === 'awaiting-bid';
  });
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
        from: 'trips',
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
        from: 'users',
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
  ]);

  return activeBids;
}