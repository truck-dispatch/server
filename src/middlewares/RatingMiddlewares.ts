import { NextFunction, Request, Response } from 'express'
import Respond from '@helpers/Respond'

class RatingMiddlewares {
  allDataForRatingIsCorrect(req: Request, res: Response, next: NextFunction) {
    try {
      const { userRating, userRated, tripId, starRating } = req.body
      if (!userRating || !userRated || !tripId || !starRating)
        return Respond.error(
          res,
          'userRating, userRated, tripId, starRating are compulsory fields'
        )
      if (isNaN(Number(starRating)))
        return Respond.error(res, 'starRating must be a number')

      next()
    } catch (err) {
      console.log(err)
    }
  }
}

export default new RatingMiddlewares()
