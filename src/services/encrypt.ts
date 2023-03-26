import bcrypt from 'bcrypt'

export function encrypt(password: string, salt: number = 10): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        reject(err.message)
      } else {
        resolve(hash)
      }
    })
  })
}
export function compareHashAndPassword(
  hashed: string,
  password: string
): Promise<boolean> {
  return bcrypt
    .compare(password, hashed)
    .then((result) => result)
    .catch((err) => {
      console.error(err)
      return Promise.resolve(false)
    })
}
