import Paystack from '@services/Paystack'
import BankDetails from 'interfaces/BankDetails'
import User from 'interfaces/User'
import { Types } from 'mongoose'
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

export async function creditUser(
  userId: string | Types.ObjectId,
  amount: number
) {
  return UserModel.findOneAndUpdate(
    { _id: userId },
    { $inc: { balance: amount } },
    { new: true }
  )
}

export async function debitUser(
  userId: string | Types.ObjectId,
  amount: number
) {
  return UserModel.findOneAndUpdate(
    { _id: userId },
    { $inc: { ledgerBalance: -amount } },
    { new: true }
  )
}

export async function creditUserLedgerBalance(
  userId: string | Types.ObjectId,
  amount: number
) {
  return UserModel.findOneAndUpdate(
    { _id: userId },
    { $inc: { ledgerBalance: amount } },
    { new: true }
  )
}

export async function debitUserLedgerBalance(
  userId: string | Types.ObjectId,
  amount: number
) {
  const user = await UserModel.findById(userId)

  if (!user) {
    throw new Error('User not found') // Throw an error if the user is not found
  }

  if (user.ledgerBalance! < amount) {
    throw new Error('Insufficient balance') // Throw an error if the ledger balance is not sufficient
  }

  return UserModel.findOneAndUpdate(
    { _id: userId },
    { $inc: { ledgerBalance: -amount } },
    { new: true }
  )
}
