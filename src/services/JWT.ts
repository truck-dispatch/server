import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@common/privateKeys'
import User from 'interfaces/User'

export function generateJWT(payload: any, expiresIn: string | number = '1w') {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn })
}
export function decodeToken<T>(token: string): T | void{
  try {
    return jwt.verify(token, JWT_SECRET!) as T
  } catch (err) {
    return;
  }
}

export function getUserCredentialsFromReq(req: Request) {
  const token = req.headers.authorization?.split(' ')[1]

  const decodedToken = decodeToken<User>(token!);

  if (!decodedToken) return {} as User
  const { _id, userType } = decodedToken

  return { _id, userType }
}
