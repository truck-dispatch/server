import Paystack from '@services/Paystack'
import BankDetails from 'interfaces/BankDetails'
import User from 'interfaces/User'
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

export async function getUsers(param: Partial<User>) {
  const users = await UserModel.find(param).lean()

  const getAllUsers = await Promise.all(users.map(async (users) => users))

  return getAllUsers
}

export async function updateUserBankDetails(
  searchParam: Partial<User>,
  data: BankDetails
) {
  const bankDetails = {
    type: 'nuban',
    name: data.name,
    account_number: data.account_number,
    bank_code: data.bank_code,
    bank_name: data.bank_name,
    currency: 'NGN',
  }

  const transferRecipient = await Paystack.createTransferRecipient(bankDetails)
  return findAndUpdateUserBy(searchParam, {
    bankDetails: {
      ...bankDetails,
      paystackRecipientId: transferRecipient.id,
      paystackRecipientCode: transferRecipient.recipient_code,
    },
  })
}

export async function findUsersBy(param: Partial<User>) {
  const users = await UserModel.find(param).lean()

  return users
}

export function deleteAllUsers() {
  console.log('all users are about to be deleted')
  UserModel.deleteMany({})
}
