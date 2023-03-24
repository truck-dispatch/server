import User from '../../../types/User'
import { UserSchema } from './user.model'

export function createUser(user: Partial<User>) {
  const data = new UserSchema(user)
  return data.save()
}

export function findUserBy(param: Partial<User>, deletePassword = true) {
  return UserSchema.findOne(param)
}

export function findAndUpdateUserBy(
  searchParam: Partial<User>,
  data: Partial<User>
) {
  return UserSchema.findOneAndUpdate(searchParam, data, { new: true })
}

export function deleteAllUsers() {
  console.log('all users are about to be deleted')
  UserSchema.deleteMany({})
}
