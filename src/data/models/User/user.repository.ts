import User from '../../../types/User'
import { UserModel } from './UserModel'

export function createUser(user: Partial<User>) {
  const data = new UserModel(user)
  return data.save()
}

export async function findUserBy(
  param: Partial<User>,
  deletePassword = true
): Promise<User | null> {
  const user = await UserModel.findOne(param)
  if (!user) {
    return null
  }

  if (!deletePassword) return user.toObject()

  const { password, ...userWithoutPassword } = user.toObject()
  return userWithoutPassword as unknown as User
}

export function findAndUpdateUserBy(
  searchParam: Partial<User>,
  data: Partial<User>
) {
  return UserModel.findOneAndUpdate(searchParam, data, { new: true })
}

export function deleteAllUsers() {
  console.log('all users are about to be deleted')
  UserModel.deleteMany({})
}
