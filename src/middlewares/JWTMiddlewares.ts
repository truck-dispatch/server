import { NextFunction, Request, Response } from 'express'
import { clientUserTypes, serviceBasedUserTypes } from '../common/constants'
import { findUserBy } from '../data/user/userRepository'
import Respond from '../helpers/Respond'
import { decodeToken, getUserFromReq } from '../services/JWT'
import User from '../types/User'

class JWTMiddlewares {
  async jwtIsValid(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return Respond.error(res, 'No JWT was provided', 401)
      }

      const decodedUser = decodeToken(token) as User

      if (!decodedUser) {
        return Respond.error(res, 'Invalid JWT', 401)
      }

      const user = await findUserBy({ _id: decodedUser._id })

      if (!user) return Respond.error(res, 'User does not exist', 401)
      next()
    } catch (err) {
      Respond.error(res, (err as Error).message)
    }
  }

  checkisClientBasedUserType(req: Request, res: Response, next: NextFunction) {
    try {
      const { userType } = getUserFromReq(req)

      if (!clientUserTypes.includes(userType))
        return Respond.error(
          res,
          'Only client based user types can access this route',
          401
        )
      next()
    } catch (err) {
      console.log(err)
    }
  }

  checkIsServiceBasedUserType(req: Request, res: Response, next: NextFunction) {
    try {
      const { userType } = getUserFromReq(req)

      if (!serviceBasedUserTypes.includes(userType))
        return Respond.error(
          res,
          'Only service based user types can access this route',
          401
        )
      next()
    } catch (err) {
      console.log(err)
    }
  }

  async checkUserStatusIsVerified(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { _id } = getUserFromReq(req)

    const user = await findUserBy({ _id })
    if (user?.status !== 'verified') {
      return Respond.error(res, 'Verification is required to access this route')
    }
    next()
  }
}

export default new JWTMiddlewares()
