import { NextFunction, Request, Response } from 'express'
import {
  createRating,
  getUsersNewRating,
  findRatingBy,
} from '@data/rating/ratingRepository'
import { findAndUpdateUserBy, findUserBy } from '@data/user/userRepository'
import Respond from '@helpers/Respond'

class RatingController {
  async rateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { comment, userRating, userRated, tripId, starRating } = req.body
      await createRating({
        comment,
        userRating,
        userRated,
        tripId,
        starRating: Number(starRating),
      })
      const user = await findUserBy({ _id: userRated })

      const rating = await getUsersNewRating(user?._id!)
      const noOfRatingsReceived = user?.noOfRatingsReceived
        ? user?.noOfRatingsReceived + 1
        : 1
      await findAndUpdateUserBy(
        { _id: userRated },
        { rating, noOfRatingsReceived }
      )
      return Respond.success(
        res,
        'Your rating has been saved. Your ratings helps ensure we keep a safe community'
      )
    } catch (err) {
      next(err)
    }
  }

  async getTripRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params

      const rating = await findRatingBy({ tripId })

      return Respond.success(
        res,
        'Your rating has been saved. We would look into your ratings ',
        rating
      )
    } catch (err) {
      next(err)
    }
  }
}

export default new RatingController()
