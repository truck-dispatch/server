import {
  COMPANY_NAME,
  EMAIL_PASSWORD,
  NO_REPLY_EMAIL_ADDRESS,
} from '../common/privateKeys'
import nodemailer from 'nodemailer'

class Mail {
  private transport = nodemailer.createTransport({
    port: 465,
    secure: true,
    host: 'smtp.titan.email',
    auth: {
      user: NO_REPLY_EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD,
    },
  })

  requestResetPassword(to: string, name: string, url: string) {
    const template = `<!DOCTYPE html>
    <html>
    <head>
      <title>Verify Email</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <h1 style="text-align: left;">Verify Email</h1>
      <p style="text-align: left;">Dear ${name},</p>
      <p style="text-align: left;">You recently requested to reset your password. Please click the link below to reset your password:</p>
    
      <div style="text-align: left;">
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset your password</a>
      </div>
    
      <p style="text-align: left;">If you did not request to reset your password, please ignore this email.</p>
      
      <p style="text-align: left; border-top: 1px solid #ccc; padding-top: 10px">Thank you,</p>
      <p style="text-align: left;">${COMPANY_NAME}</p>
      
    </body>
    </html>
    `
    const mailOptions = {
      to,
      from: NO_REPLY_EMAIL_ADDRESS,
      subject: 'Reset Password',
      html: template,
    }

    return this.transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err)
        return Promise.reject(err)
      } else return Promise.resolve(info)
    })
  }

  verifyMail(to: string, name: string, verifyEmailUrl: string) {
    const template = `<!DOCTYPE html>
    <html>
    <head>
      <title>Verify Email</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <h1 style="text-align: left;">Verify Email</h1>
      <p style="text-align: left;">Dear ${name},</p>
      <p style="text-align: left;">You recently requested to verify your email. Please click the link below to verify your email:</p>
    
      <div style="text-align: left;">
        <a href="${verifyEmailUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
      </div>
    
      
      <p style="text-align: left; border-top: 1px solid #ccc; padding-top: 10px">Thank you,</p>
      <p style="text-align: left;">${COMPANY_NAME}</p>
      
    </body>
    </html>
    `

    const mailOptions = {
      to,
      from: NO_REPLY_EMAIL_ADDRESS,
      subject: 'Verify Email',
      html: template,
    }
    return this.transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err)
        return Promise.reject(err)
      } else return Promise.resolve(info)
    })
  }
}

export default new Mail()
