import {
  COMPANY_NAME,
  EMAIL_PASSWORD,
  FRONTEND_URL,
  NO_REPLY_EMAIL_ADDRESS,
} from '@common/privateKeys'
import nodemailer from 'nodemailer'

interface TemplateProps {
  title: string
  actionText?: string
  actionUrl?: string
  firstParagraph?: string
  paragraphAfterActionLink?: string
}
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

  private sendMail(to: string, subject: string, template: string) {
    return this.transport.sendMail(
      {
        to,
        from: NO_REPLY_EMAIL_ADDRESS!,
        subject,
        html: template,
      },
      (err, info) => {
        if (err) {
          console.log(err)
          return Promise.reject(err)
        } else return Promise.resolve(info)
      }
    )
  }

  private emailTemplate({
    title,
    actionText,
    actionUrl,
    firstParagraph,
    paragraphAfterActionLink,
  }: TemplateProps) {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; width: 400px; margin: auto; text-align: left;">
      ${
        firstParagraph
          ? `<p style="text-align: left; color: #000;">${firstParagraph}</p>`
          : ''
      }

      ${actionUrl ?`<div style="text-align: left;">
        <a href="${actionUrl}" style="color: #4326C4; text-decoration: underline; border-radius: 8px;">${actionText}</a>
      </div>` : ''}
    
      ${
        paragraphAfterActionLink
          ? `<p style="  color: #000;">${paragraphAfterActionLink}</p>`
          : ''
      }
      
      <p style="text-align: left; border-top: 1px solid #DCDAE4; padding-top: 10px">The ${COMPANY_NAME} team.</p>
      <a href="${FRONTEND_URL}" style="color: #4326C4;">${FRONTEND_URL}</a>
    </body>
    </html>
    `
  }

  portFromFirebase(to: string, url: string) {
    const template = this.emailTemplate({
      title: 'Reset Password',
      actionUrl: url,
      actionText: 'Reset your password',
      firstParagraph: `We recently underwent a database upgrade; Due to that, all previous passwords have been lost. Kindly reset your password to regain access to your dashboard.`,
      paragraphAfterActionLink: `If you don't wish to reset your password, disregard this email and no action will be taken.`,
    })

    return this.sendMail(to, 'Reset Password', template)
  }

  requestResetPassword(to: string, url: string) {
    const template = this.emailTemplate({
      title: 'Reset Password',
      actionUrl: url,
      actionText: 'Reset your password',
      firstParagraph: `Someone(hopefully you) has requested a password reset for your ${COMPANY_NAME} account. Follow the link below to set a new password.`,
      paragraphAfterActionLink: `This email expires in one hour. If you don't wish to reset your password, disregard this email and no action will be taken.`,
    })

    return this.sendMail(to, 'Reset Password', template)
  }

  verifyMail(to: string, url: string) {
    const template = this.emailTemplate({
      title: 'Verify Email',
      actionUrl: url,
      actionText: 'Verify Email',
      firstParagraph: `Welcome to ${COMPANY_NAME}; Follow the link below to verify your email`,
      paragraphAfterActionLink: `This link expires in 1 day`,
    })

    return this.sendMail(to, 'Verify Email', template)
  }

  newUserSignedUp(userName: string) {
    const template = this.emailTemplate({
      title: 'A new user signed up',
      firstParagraph: `${userName} just signed up to the platform.`,
    })
    return this.sendMail('admin@gettruckdispatch.com', 'A new user signed up', template)
  }
  newTripCreated() {
    const template = this.emailTemplate({
      title: 'A new trip has been created',
      firstParagraph: `A new trip has been created`,
    })
    return this.sendMail('admin@gettruckdispatch.com', 'A new trip has been created', template)
  }
  transporterHasSentBid(to: string, transporterName: string, url: string) {
    const template = this.emailTemplate({
      title: 'Your trip just received a bid',
      actionUrl: url,
      actionText: 'View Bid',
      firstParagraph: `${transporterName} just sent a bid to your job. Follow this link to view the bid and negotiate or accept it.`,
    })
    return this.sendMail(to, 'A bid has been received for your trip', template)
  }

  transporterHasUpdatedBid(to: string, transporterName: string, url: string) {
    const template = this.emailTemplate({
      title: 'A bid to your trip has been updated',
      actionUrl: url,
      actionText: 'View Bid',
      firstParagraph: `${transporterName} just updated his bid to your job. Follow this link to view the bid and negotiate or accept it.`,
    })

    return this.sendMail(to, 'A bid has been updated', template)
  }

  bidHasBeenAccepted(
    to: string,
    pickUpLocation: string,
    deliveryLocation: string,
    tripOwnerName: string,
    url: string
  ) {
    const template = this.emailTemplate({
      title: 'Bid has been accepted',
      actionUrl: url,
      actionText: 'View Trip',
      firstParagraph: `Your bid has been accepted for a trip going from ${pickUpLocation} to ${deliveryLocation} by ${tripOwnerName}. Kindly proceed to the dashboard to proceed with the trip. `,
      paragraphAfterActionLink: `Thank you for working with us.`,
    })
    return this.sendMail(to, 'Verify Email', template)
  }

  tripStarted(
    to: string,
    pickUpLocation: string,
    deliveryLocation: string,
    tripOwnerName: string,
    url: string
  ) {
    const template = this.emailTemplate({
      title: 'Bid has been accepted',
      actionUrl: url,
      actionText: 'View Trip',
      firstParagraph: `Your bid has been accepted for a trip going from ${pickUpLocation} to ${deliveryLocation} by ${tripOwnerName}. Kindly proceed to the dashboard to proceed with the trip. `,
      paragraphAfterActionLink: `Thank you for working with us.`,
    })

    return this.sendMail(to, 'Transporter has commenced the trip', template)
  }

  accountHasBeenVerifiedByAdmin(to: string, url: string) {
    const template = this.emailTemplate({
      title: 'Verify Email',
      actionUrl: url,
      actionText: 'Verify Email',
      firstParagraph: `Welcome to ${COMPANY_NAME}; Follow the link below to verify your email`,
      paragraphAfterActionLink: `This link expires in 1 day`,
    })

    return this.sendMail(to, 'Your account has been verified', template)
  }

  paymentHasBeenRequestedByTransporter(
    to: string,
    url: string,
    transporterName: string
  ) {
    const template = this.emailTemplate({
      title: 'Review transporters payment request',
      actionUrl: url,
      actionText: 'Review payment request',
      firstParagraph: `${transporterName} has requested payment for a trip. Transporters require payment before they can proceed with the trip. Follow the link below to review payment request `,
      paragraphAfterActionLink: `Ensure that the proof of loading is the same as what was described in the bid made by ${transporterName}`,
    })

    return this.sendMail(
      to,
      'Transporter has requested payment for his trip',
      template
    )
  }
  paymentHasBeenUpdatedByTransporter(
    to: string,
    url: string,
    transporterName: string
  ) {
    const template = this.emailTemplate({
      title: 'Payment request has been updated',
      actionUrl: url,
      actionText: 'Review payment request',
      firstParagraph: `${transporterName} has updated his request for payment for a trip. Transporters require payment before they can proceed with the trip. Follow the link below to review payment request.`,
      paragraphAfterActionLink: `Ensure that the proof of loading is the same as what was described in the bid made by ${transporterName}`,
    })

    return this.sendMail(
      to,
      'Transporter has updated request for payment to your trip',
      template
    )
  }
  paymentRequestHasBeenRejected(
    to: string,
    url: string,
    tripOwnerName: string
  ) {
    const template = this.emailTemplate({
      title: 'Payment request has been rejected',
      actionUrl: url,
      actionText: 'Review payment request',
      firstParagraph: `${tripOwnerName} has rejected your payment request. To view his comment on the request, click the link below to see why your request was rejected and work on it.`,
    })

    return this.sendMail(to, 'Your payment request has been rejected', template)
  }
  paymentRequestHasBeenApproved(
    to: string,
    url: string,
    tripOwnerName: string
  ) {
    const template = this.emailTemplate({
      title: 'Payment request has been approved',
      actionUrl: url,
      actionText: 'Proceed with trip',
      firstParagraph: `${tripOwnerName} has approved your payment request therefore your money is on it's way to your account. If the money does not reflect in the next 1hr, kindly contact us via email support@gettruckdispatch.com or use the chat dialogue at the bottom of the page.`,
    })

    return this.sendMail(to, "Your money is on it's way", template)
  }

  tripHasBeenSetToInProgress(to: string, url: string, transporterName: string) {
    const template = this.emailTemplate({
      title: 'Trip has been placed in-progress',
      actionUrl: url,
      actionText: 'View Trip',
      firstParagraph: `${transporterName} has started the trip, keep calm and expect your delivery soon.`,
      paragraphAfterActionLink:
        'If you notice any issues with your trips, kindly reach out to our customer service and they would help you address any issues that exist.',
    })

    return this.sendMail(to, "Your  goods are on it's way", template)
  }
  tripHasBeenSetToCompleted(to: string, url: string, transporterName: string) {
    const template = this.emailTemplate({
      title: 'Your goods have arrived',
      actionUrl: url,
      actionText: 'Rate Transporter',
      firstParagraph: `${transporterName} has completed the trip. Thank you for choosing ${COMPANY_NAME}. Kindly help us rate ${transporterName}, as it would help keep our platform safe`,
      paragraphAfterActionLink: `If the trip has not arrived yet, please inform the ${COMPANY_NAME} team to investigate immediately.`,
    })

    return this.sendMail(to, 'Your goods have arrived', template)
  }
}

export default new Mail()
