import { AdminModel } from './AdminModal'
import Admin from '../../../types/Admin'

export function createAdmin(admin: Partial<Admin>) {
  const data = new AdminModel(admin)
  return data.save()
}

export async function findAdminBy(
  param: Partial<Admin>,
  deletePassword = true
): Promise<Admin | null> {
  const user = await AdminModel.findOne(param)
  if (!user) {
    return null
  }

  if (!deletePassword) return user.toObject()

  const { password, ...userWithoutPassword } = user.toObject()
  return userWithoutPassword as unknown as Admin
}
