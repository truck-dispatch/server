import { NextFunction, Request, Response } from 'express'

class AuthController {
  registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, phone, userType, firstName, lastName } = req.body
    } catch (err) {
      next(err)
    }
  }
}

export default new AuthController()
