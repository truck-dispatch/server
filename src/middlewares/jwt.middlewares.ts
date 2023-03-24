import { NextFunction, Request, Response } from 'express'
import Respond from '../helpers/Respond'
import { decodeToken } from '../services/JWT'

class JWTMiddlewares {
  jwtIsValid(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return Respond.error(res, 'No JWT was provided', 401)
      }

      const decodedToken = decodeToken(token)

      if (!decodedToken) {
        return Respond.error(res, 'Invalid JWT', 401)
      }

      next()
    } catch (err) {
      Respond.error(res, (err as Error).message)
    }
  }

  checkIsAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      const decodedToken = decodeToken(token!)

      console.log(decodedToken)
      next()
    } catch (err) {
      console.log(err)
    }
  }
}

export default new JWTMiddlewares()
