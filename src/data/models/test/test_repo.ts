import Bid from '../../../types/Bid'
import { findUserBy } from '../User/UserRepository'
import { BidModel } from '../bid/BidModel'
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
