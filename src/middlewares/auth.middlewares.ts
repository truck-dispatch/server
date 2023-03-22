import { UserSchema } from '../data/models/User/user.model'

class AuthMiddlewares {
  private async userWithEmailExists(email: string) {
    const user = await UserSchema.findOne({ email })
    return !!user
  }

  private async userWithPhoneExists(phone: string) {
    const user = await UserSchema.findOne({ phone })
    return !!user
  }
}
