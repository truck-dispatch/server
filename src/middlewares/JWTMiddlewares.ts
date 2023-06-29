import { NextFunction, Request, Response } from 'express'
import { decodeToken, getUserCredentialsFromReq } from '../services/JWT'
import User from '../interfaces/User'
import { clientUserTypes, serviceBasedUserTypes } from '@common/constants'
import { findUserBy } from '@data/user/userRepository'
import Respond from '@helpers/Respond'
import { findAdminBy } from '@data/Admin/adminRepository'

class JWTMiddlewares {
  async jwtIsValid(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return Respond.error(res, 'No JWT was provided', 401)
      }
      // If auth exists, it means it's a token meant for auth and is not valid for the dashboard.
      const decodedUser = decodeToken(token) as User & { auth?: true}

      if (!decodedUser || decodedUser.auth) {
        return Respond.error(res, 'Invalid JWT', 401)
      }

      const user = await findUserBy({ _id: decodedUser._id })

      if (!user) return Respond.error(res, 'User does not exist', 401)

      if (user.isSuspended) return Respond.error(res, 'User has been suspended. reach out to admin for more information');
      next()
    } catch (err) {
      Respond.error(res, 'Invalid JWT')
    }
  }

  checkisClientBasedUserType(req: Request, res: Response, next: NextFunction) {
    try {
      const { userType } = getUserCredentialsFromReq(req)
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
      const { userType } = getUserCredentialsFromReq(req)

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
    const { _id } = getUserCredentialsFromReq(req)

    const user = await findUserBy({ _id })
    if (user?.status !== 'verified') {
      return Respond.error(res, 'Verification is required to access this route')
    }
    next()
  }

  async checkAdminJwt(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return Respond.error(res, 'No JWT was provided', 401)
      }

      const decodedUser = decodeToken(token) as User

      if (!decodedUser) {
        return Respond.error(res, 'Invalid JWT', 401)
      }

      const admin = await findAdminBy({ _id: decodedUser._id })
      if (!admin) return Respond.error(res, 'Admin does not exist', 401)
      next()
    } catch (err) {
      Respond.error(res, (err as Error).message)
    }
  }
}

export default new JWTMiddlewares()
