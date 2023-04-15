import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@common/privateKeys'
import User from 'interfaces/User'

export function generateJWT(payload: any, expiresIn: string | number = '1w') {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn })
}
export function decodeToken<T>(token: string): T {
  try {
    return jwt.verify(token, JWT_SECRET!) as T
  } catch (err) {
    throw new Error((err as Error).message)
  }
}

export function getUserCredentialsFromReq(req: Request) {
  const token = req.headers.authorization?.split(' ')[1]
  const { _id, userType } = decodeToken<User>(token!)

  return { _id, userType }
}
