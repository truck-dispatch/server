import bcrypt from 'bcrypt';

export function encrypt(password: string, salt: number = 10): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(hash);
      }
    });
  });
}

export function comparePassword(hashedPassword: string, password: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(err?.message);
      }
    });
  });
}
