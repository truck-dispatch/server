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
  const admin = await AdminModel.findOne(param)
  if (!admin) {
    return null
  }
  
  if (!deletePassword) return admin.toObject()

  const { password, ...adminWithoutPassword } = admin.toObject()
  return adminWithoutPassword as unknown as Admin
}
