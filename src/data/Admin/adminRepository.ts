import { AdminModel } from './AdminModel'
import Admin from 'interfaces/Admin'

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
export async function findAdminsBy(
  param: Partial<Admin>
): Promise<Admin[] | null> {
  const admins = await AdminModel.find(param).select('-password')

  return admins
}

export async function deleteAdminById(adminId: string) {
  return AdminModel.deleteOne({ _id: adminId })
}