import Rating from 'interfaces/Rating'
import { RatingModel } from './RatingModel'

interface CreateRatingBody extends Omit<Rating, '_id'> {
  _id?: string
}

export function createRating(data: CreateRatingBody) {
  const rating = new RatingModel(data)
  return rating.save()
}

export function findRatingBy(searchParams: Partial<Rating>) {
  return RatingModel.findOne(searchParams)
}

export function findRatingsBy(searchParams: Partial<Rating>) {
  return RatingModel.find(searchParams)
    .populate('userRating', '-password')
    .populate('userRated', '-password')
}

export async function getUsersNewRating(userId: string) {
  const ratings = await RatingModel.find({ userRated: userId }).lean()

  const starRatings = ratings.map((r) => Number(r.starRating))

  const totalRating = starRatings.reduce(
    (accumulator, currentValue) => accumulator + currentValue
  )

  const average = totalRating / starRatings.length
  const rounded = Math.round(average * 2) / 2 // round to nearest 0.5
  if (rounded <= 2.5) {
    return 1
  }
  return Math.min(rounded, 5) // cap at 5
}
