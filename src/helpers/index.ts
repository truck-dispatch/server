import { Request } from 'express'
import { uuid } from 'uuidv4'

export class Helpers {
  static isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static extractFileFromReq(req: Request, nameOfFile: string) {
    // @ts-ignore
    if (req.files?.[nameOfFile]) return req.files?.[nameOfFile][0]
    else return null
  }
  static extractPublicIdFromURL(url: string) {
    const regex = /\/v\d+\/(.+)\.mp4/i
    const match = url.match(regex)
    if (match && match.length > 1) {
      const publicId = match[1]
      console.log(publicId)
    } else return ''
  }
  static convertPhone(phone: string) {
    // Remove any non-digits from the input phone
    phone = phone.replace(/\D/g, '')

    // If the phone starts with '0', replace it with '+234'
    if (phone.startsWith('0')) {
      phone = '+234' + phone.substring(1)
    }

    // If the phone starts with '234', replace it with '+234'
    if (phone.startsWith('234')) {
      phone = '+234' + phone.substring(3)
    }
    // Return the formatted phone
    return phone
  }
  static generateReference() {
    const alphanumeric =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let key = ''
    for (let i = 0; i < 6; i++) {
      key += alphanumeric.charAt(
        Math.floor(Math.random() * alphanumeric.length)
      )
    }
    return key
  }
  static nairaToKobo(amount: string | number) {
    let value = amount
    if (typeof value === 'string') {
      value = parseInt(`${amount}`)
    }
    return value * 100
  }
  static generateUuid() {
    return uuid()
  }
}
