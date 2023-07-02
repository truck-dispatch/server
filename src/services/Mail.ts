import {
  COMPANY_NAME,
  EMAIL_PASSWORD,
  NO_REPLY_EMAIL_ADDRESS,
} from '@common/privateKeys'
import nodemailer from 'nodemailer'
import { styles } from './mail/assets/styles'

const icons = {
  padlock: 'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328062/assets/gws6dkltdt7b7qmatots.png',
  close: 'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688325062/assets/nvkcjbww66grnef7oznz.png',
  moneys: 'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328169/assets/punb1u2ouspvcdijs9td.png',
  user: 'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328269/assets/leavkexonhgoz28cng4v.png',
  truck: 'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328400/assets/rcdsnkl2nzfpzhfsgin2.png',
  truckTime: 'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328484/assets/qv7ybhlxdvpiydl6ws2b.png',
  receipe: 'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328590/assets/i5sz4x8zkruh8ybrdnah.png',
  avatar: 'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688329364/assets/ha5ajd1ubxfj57frbidh.png'
}

interface TemplateProps {
  title: string;
  content?: string;
  icon?: string;
  actionText?: string;
  actionUrl?: string;
  firstParagraph?: string;
  paragraphAfterActionLink?: string;
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
    content,
    icon
  }: TemplateProps) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} lorem</title>
        ${styles}
      </head>
      <body class="template">
        <div class="mail-body">
          <a href="https://www.gettruckdispatch.com/" class="logo-container">
            <img src="https://res.cloudinary.com/dpxb6epv3/image/upload/v1688316396/assets/yfvpnj3okri3o3u3wgpk.png" width="30" height="30" alt="truckdispatch-logo">
            <span class="logo-title">TruckDispatch</span>
          </a>
          ${!!icon && `
              <div class="icon-container mt-32">
                <div class="icon-container__inner"><img src="${icon}" alt="category icon" /></div>
              </div>
          `}
          <div class="mail-card mt-32">
            <section>
              <h1>${title}</h1>
              ${content}
            </section>
          </div>
          <div class="info-container">
            <div class="mt-16">
              The Truckdispatch Team.
            </div>
            <div class="mt-32">
              Copyright © Truckdispatch. ${new Date().getFullYear()} All Rights Reserved
            </div>
            <a href="https://www.gettruckdispatch.com/" class="logo-container mx-auto mt-32">
              <img src="https://res.cloudinary.com/dpxb6epv3/image/upload/v1688316396/assets/yfvpnj3okri3o3u3wgpk.png" width="30" height="30" alt="truckdispatch-logo">
              <span class="logo-title">TruckDispatch</span>
            </a>
              <div class="social-icons mt-32">
                <a href="twitter.com" class="social-link">
                  <img src="https://res.cloudinary.com/dpxb6epv3/image/upload/v1688308501/assets/g2vlasdrthm0jr9zpfc2.jpg" alt="twitter-logo">
                </a>
                <a href="https://www.linkedin.com/company/truckdispatch/" class="social-link">
                  <img src="https://res.cloudinary.com/dpxb6epv3/image/upload/v1688308265/assets/o2inkopsdnga18lk5sp4.jpg" alt="linked-in logo">
                </a>
                <a href="https://www.instagram.com/gettruckdispatch/" class="social-link">
                  <img src="https://res.cloudinary.com/dpxb6epv3/image/upload/v1688308416/assets/xmyy3djwrhkhxfznhj4h.jpg" alt="instagram logo">
                </a>
                <a href="https://www.instagram.com/gettruckdispatch/" class="social-link">
                  <img src="https://res.cloudinary.com/dpxb6epv3/image/upload/v1688308605/assets/qybt981czug696m7i5ym.jpg" alt="instagram logo">
                </a>
              </div>
          </div>
        </div>
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
      title: 'Password Reset',
      content: `
        <p class="content-paragraph">
          Someone (hopefully you) has requested a password reset for you Truckdispatch account. Click on the below button to continue to reset your password
        </p>
        <a href="${url}" class="action-trigger mt-16 mb-16">reset password</a>
        <p class="content-paragraph">
          If you don’t wish to reset your password, disregard this email and no action will be taken.
        </p>
      `,
      icon: icons.padlock
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
  transporterHasSentBid(to: string, transporterName: string, url: string, transporterAvatar?: string, ) {
    const template = this.emailTemplate({
      title: 'Bid Received',
      content: `
        <p>
          <b>${transporterName}</b> just sent a bid to your job. Click on the button below to view bid and negotiate or accept bid.
        </p>
        <div class="content-purple-info-container mt-32 mb-32 fit-content">

          <div class="item-label">Transporter</div>

          <div class="d-flex">
            <img src="${transporterAvatar || icons.avatar}" class="avatar" alt="user avatar">
            <div class="user-profile-details ml-8">
              <div>
                <div class="user-name">${transporterName}</div>
                <div class="user-contact">************</div>
              </div>
              <a href="" class="secondary-btn ml-24">View Profile</a>
            </div>
          </div>
        </div>
        <a href="${url}" class="action-trigger mt-32 mb-32">View Bid</a>
        <p class="mb-32">Thank you for working with us.</p>
      `,
      icon: icons.truck
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
