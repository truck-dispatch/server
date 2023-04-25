import {
  COMPANY_NAME,
  EMAIL_PASSWORD,
  NO_REPLY_EMAIL_ADDRESS,
} from '@common/privateKeys'
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

  private emailTemplate({
    title,
    actionText,
    actionUrl,
    firstParagraph,
    paragraphAfterActionLink,
  }: {
    title: string
    actionText: string
    actionUrl: string
    firstParagraph?: string
    paragraphAfterActionLink?: string
  }) {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; width: 400px; margin: auto; text-align: left;">
      ${
        firstParagraph &&
        `<p style="text-align: left; color: #000;">${firstParagraph}</p>`
      }

      <div style="text-align: left;">
        <a href="${actionUrl}" style="color: #4326C4; text-decoration: underline; border-radius: 8px;">${actionText}</a>
      </div>
    
      ${
        paragraphAfterActionLink &&
        `<p style="  color: #000;">${paragraphAfterActionLink}</p>`
      }
      
      <p style="text-align: left; border-top: 1px solid #DCDAE4; padding-top: 10px">The ${COMPANY_NAME} team.</p>
      <a href="https://www.gettruckdispatch.com/" style="color: #4326C4;">https://www.gettruckdispatch.com/</a>
    </body>
    </html>
    `
  }

  portFromFirebase(to: string, url: string) {
    try {
      const template = this.emailTemplate({
        title: 'Reset Password',
        actionUrl: url,
        actionText: 'Reset your password',
        firstParagraph: `We recently underwent a database upgrade; Due to that, all previous passwords have been lost. Kindly reset your password to regain access to your dashboard.`,
        paragraphAfterActionLink: `If you don't wish to reset your password, disregard this email and no action will be taken.`,
      })
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
    } catch (err) {
      console.log('error:', err)
    }
  }

  requestResetPassword(to: string, url: string) {
    try {
      const template = this.emailTemplate({
        title: 'Reset Password',
        actionUrl: url,
        actionText: 'Reset your password',
        firstParagraph: `Someone(hopefully you) has requested a password reset for your ${COMPANY_NAME} account. Follow the link below to set a new password.`,
        paragraphAfterActionLink: `If you don't wish to reset your password, disregard this email and no action will be taken.`,
      })

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
    } catch (err) {
      console.log(err)
    }
  }

  verifyMail(to: string, url: string) {
    try {
      const template = this.emailTemplate({
        title: 'Verify Email',
        actionUrl: url,
        actionText: 'Verify Email',
        firstParagraph: `Welcome to ${COMPANY_NAME}; Follow the link below to verify your email`,
        paragraphAfterActionLink: `This link expires in 1 day`,
      })

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
    } catch (err) {
      console.log(err)
    }
  }

  transporterHasSentBid(to: string, transporterName: string, url: string) {
    try {
      const template = this.emailTemplate({
        title: 'Your trip just received a bid',
        actionUrl: url,
        actionText: 'View Bid',
        firstParagraph: `${transporterName} just sent a bid to your job. Follow this link to view the bid and negotiate or accept it.`,
      })

      const mailOptions = {
        to,
        from: NO_REPLY_EMAIL_ADDRESS,
        subject: 'A bid has been received for your trip',
        html: template,
      }
      return this.transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err)
          return Promise.reject(err)
        } else return Promise.resolve(info)
      })
    } catch (err) {
      console.log(err)
    }
  }
  transporterHasUpdatedBid(to: string, transporterName: string, url: string) {
    try {
      const template = this.emailTemplate({
        title: 'A bid to your trip has been updated',
        actionUrl: url,
        actionText: 'View Bid',
        firstParagraph: `${transporterName} just updated his bid to your job. Follow this link to view the bid and negotiate or accept it.`,
      })

      const mailOptions = {
        to,
        from: NO_REPLY_EMAIL_ADDRESS,
        subject: 'Transporter has updated bid',
        html: template,
      }
      return this.transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err)
          return Promise.reject(err)
        } else return Promise.resolve(info)
      })
    } catch (err) {
      console.log(err)
    }
  }
  bidHasBeenAccepted(
    to: string,
    pickUpLocation: string,
    deliveryLocation: string,
    tripOwnerName: string,
    url: string
  ) {
    try {
      const template = this.emailTemplate({
        title: 'Bid has been accepted',
        actionUrl: url,
        actionText: 'View Trip',
        firstParagraph: `Your bid has been accepted for a trip going from ${pickUpLocation} to ${deliveryLocation} by ${tripOwnerName}. Kindly proceed to the dashboard to proceed with the trip. `,
        paragraphAfterActionLink: `Thank you for working with us.`,
      })

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
    } catch (err) {
      console.log(err)
    }
  }
  accountHasBeenVerifiedByAdmin(to: string, url: string) {
    try {
      const template = this.emailTemplate({
        title: 'Verify Email',
        actionUrl: url,
        actionText: 'Verify Email',
        firstParagraph: `Welcome to ${COMPANY_NAME}; Follow the link below to verify your email`,
        paragraphAfterActionLink: `This link expires in 1 day`,
      })

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
    } catch (err) {
      console.log(err)
    }
  }

  paymentHasBeenRequestedByTransporter(to: string, url: string) {
    try {
      const template = this.emailTemplate({
        title: 'Review transporters payment request',
        actionUrl: url,
        actionText: 'Review payment request',
        firstParagraph: `Welcome to ${COMPANY_NAME}; Follow the link below to verify your email`,
        paragraphAfterActionLink: `This link expires in 1 day`,
      })

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
    } catch (err) {
      console.log(err)
    }
  }
}

export default new Mail()
