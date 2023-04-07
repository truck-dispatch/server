import { AdminModel } from './AdminModal'
import Admin from '../../../types/Admin'

export function createAdmin(admin: Partial<Admin>) {
  const data = new AdminModel(admin)
  return data.save()
}
