import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../common/privateKeys'

export function generateJWT(payload: any, expiresIn = '1w') {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn })
}

export function decodeToken(token: string) {
  return jwt.verify(token, JWT_SECRET!)
}
