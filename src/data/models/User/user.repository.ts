import User from '../../../types/User'
import { UserSchema } from './user.model'

export function createUser(user: Partial<User>) {
  const data = new UserSchema(user)
  return data.save()
}
