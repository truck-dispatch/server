import nodemailer from 'nodemailer'
import {
  COMPANY_NAME,
  EMAIL_PASSWORD,
  NO_REPLY_EMAIL_ADDRESS,
} from '@common/privateKeys'
import { styles } from './mail/assets/styles'

const icons = {
  padlock:
    'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328062/assets/gws6dkltdt7b7qmatots.png',
  close:
    'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688325062/assets/nvkcjbww66grnef7oznz.png',
  moneys:
    'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328169/assets/punb1u2ouspvcdijs9td.png',
  user: 'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328269/assets/leavkexonhgoz28cng4v.png',
  truck:
    'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328400/assets/rcdsnkl2nzfpzhfsgin2.png',
  truckTime:
    'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328484/assets/qv7ybhlxdvpiydl6ws2b.png',
  receipt:
    'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688328590/assets/i5sz4x8zkruh8ybrdnah.png',
  avatar:
    'https://res.cloudinary.com/dpxb6epv3/image/upload/v1688329364/assets/ha5ajd1ubxfj57frbidh.png',
}

interface TemplateProps {
  title: string
  content: string
  icon?: string
  to?: string
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

  private emailTemplate({ title, content, icon }: TemplateProps) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        ${styles}
      </head>
      <body class="template">
        <div class="mail-body">
          <a href="https://www.gettruckdispatch.com/" class="logo-container">
            <img src="https://res.cloudinary.com/dpxb6epv3/image/upload/v1688316396/assets/yfvpnj3okri3o3u3wgpk.png" width="30" height="30">
            <span class="logo-title">TruckDispatch</span>
          </a>
          ${
            !!icon
              ? `
              <div class="icon-container mt-32">
                <div class="icon-container__inner"><img src="${icon}" /></div>
              </div>
          `
              : ''
          }
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
      title: 'Password Reset',
      icon: icons.padlock,
      content: `
        <p> class="content-paragraph">Someone (hopefully you) tried logging into your account. The Truckdispatch team underwent a database upgrade.
        Due to this upgrade, passwords were lost. Kindly use the Link below to reset your password.</p>
        <a href="${url}" class="action-trigger mt-16 mb-16">reset password</a>
        <p class="content-paragraph">
          If you don’t wish to reset your password, disregard this email and no action will be taken.
        </p>
      `,
      to,
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
      icon: icons.padlock,
    })

    return this.sendMail(to, 'Reset Password', template)
  }
  verifyMail(to: string, url: string) {
    const template = this.emailTemplate({
      title: 'Verify Email',
      content: `
        <p class="content-paragraph">Welcome to ${COMPANY_NAME}; Follow the link below to verify your email</p>
        <a href="${url}" class="action-trigger mt-16 mb-16">VERIFY EMAIL</a>
        <p class="content-paragraph">This link expires in 1 day</p>
      `,
      to,
    })

    return this.sendMail(to, 'Verify Email', template)
  }
  newUserSignedUp(userName: string) {
    const template = this.emailTemplate({
      title: 'A new user signed up',
      content: `
        <p>${userName} just signed up to the platform.</p>
      `,
      to: 'admin@gettruckdispatch.com',
    })
    return this.sendMail(
      'admin@gettruckdispatch.com',
      'A new user signed up',
      template
    )
  }
  newTripCreated() {
    const template = this.emailTemplate({
      title: 'A new trip has been created',
      content: `<p>A new trip has been created</p>`,
      to: 'admin@gettruckdispatch.com',
    })
    return this.sendMail(
      'admin@gettruckdispatch.com',
      'A new trip has been created',
      template
    )
  }
  transporterHasSentBid(
    to: string,
    transporterName: string,
    url: string,
    transporterAvatar?: string
  ) {
    const template = this.emailTemplate({
      title: 'Bid Received',
      content: `
        <p class="content-paragraph">
          <b>${transporterName}</b> just sent a bid to your job. Click on the button below to view bid and negotiate or accept bid.
        </p>
        <div class="content-purple-info-container mt-32 mb-32 fit-content">

          <div class="item-label">Transporter Responsible</div>

          <div class="d-flex">
            <img src="${
              transporterAvatar || icons.avatar
            }" class="avatar" alt="user avatar">
            <div class="user-profile-details ml-8">
              <div>
                <div class="user-name truncate-word">${transporterName}</div>
                <div class="user-contact">************</div>
              </div>
            </div>
          </div>
        </div>
        <a href="${url}" class="action-trigger mt-32 mb-32">View Bid</a>
        <p class="mb-32">Thank you for working with us.</p>
      `,
      icon: icons.truck,
    })
    return this.sendMail(to, 'A bid has been received for your trip', template)
  }
  transporterHasUpdatedBid(
    to: string,
    transporterName: string,
    url: string,
    transporterAvatar?: string
  ) {
    const template = this.emailTemplate({
      title: 'A bid has been updated.',
      content: `
      <p class="content-paragraph">
        <b>${transporterName}</b> just updated a bid to your job. Click on the button below to view bid and negotiate or accept bid.
      </p>
      <div class="content-purple-info-container mt-32 mb-32 fit-content">

        <div class="item-label">Transporter Responsible</div>

        <div class="d-flex">
          <img src="${
            transporterAvatar || icons.avatar
          }" class="avatar" alt="user avatar">
          <div class="user-profile-details ml-8">
            <div>
              <div class="user-name truncate-word">${transporterName}</div>
              <div class="user-contact">************</div>
            </div>
          </div>
        </div>
      </div>
      <a href="${url}" class="action-trigger mt-32 mb-32">View Bid</a>
      <p class="mb-32">Thank you for working with us.</p>
    `,
      icon: icons.truck,
    })

    return this.sendMail(to, 'A bid has been updated', template)
  }
  bidHasBeenAccepted(
    to: string,
    pickUpLocation: string,
    deliveryLocation: string,
    tripOwnerName: string,
    tripOwnerAvatar: string,
    url: string
  ) {
    const template = this.emailTemplate({
      title: 'Bid Accepted',
      content: `
        <p class="content-paragraph">Your bid has been accepted for a trip going from <b>${pickUpLocation} </b>  to <b>${deliveryLocation} </b>  by  <b>${tripOwnerName} </b>. Kindly proceed to the dashboard to proceed with the trip.</p>
        <div class="content-purple-info-container mt-32 mb-32 fit-content">

          <div class="item-label">Trip Owner</div>

          <div class="d-flex">
            <img src="${
              tripOwnerAvatar || icons.avatar
            }" class="avatar" alt="user avatar">
            <div class="user-profile-details ml-8">
              <div>
                <div class="user-name truncate-word">${tripOwnerName}</div>
                <div class="user-contact">************</div>
              </div>
            </div>
          </div>
        </div>

      <a href="${url}" class="action-trigger mt-32 mb-32">View trip</a>
        <p>Thank you for working with us.</p>
      `,
      icon: icons.truck,
    })

    return this.sendMail(to, 'Bid Accepted', template)
  }
  tripStarted(
    to: string,
    pickUpLocation: string,
    deliveryLocation: string,
    tripOwnerName: string,
    url: string
  ) {
    const template = this.emailTemplate({
      title: 'Trip started',
      content: `
        <p class="content-paragraph">Your trip going from ${pickUpLocation} to ${deliveryLocation} by ${tripOwnerName} just started. Kindly proceed to the dashboard to view details on this trip.</p>
        
        <a href="${url}" class="action-trigger mt-32 mb-32">View trip</a>
        <p class="content-paragraph">Thank you for working with us.</p>
      `,
    })

    return this.sendMail(to, 'Transporter has commenced the trip', template)
  }
  accountHasBeenVerifiedByAdmin(to: string, url: string) {
    const template = this.emailTemplate({
      title: 'Account Verified 🎉 ',
      content: `
        <p class="content-paragraph">
          Congratulations! Your profile has been successfully verified! 🎉 
          We are thrilled to inform you that your account now carries the prestigious "Verified" badge, highlighting your authenticity and
          credibility within our community.
        </p>

        <a href="${url}" class="action-trigger mt-32 mb-32">View Profile</a>
      `,
      icon: icons.avatar,
    })

    return this.sendMail(
      to,
      'Your profile has been successfully verified! 🎉 ',
      template
    )
  }
  paymentHasBeenRequestedByTransporter(
    to: string,
    url: string,
    transporterName: string
  ) {
    const template = this.emailTemplate({
      title: 'Payment Requested',
      content: `
        <p class="content-paragraph"><b>${transporterName}</b> has requested payment for a trip. Transporters require payment before they can proceed with the trip. Click on the button below to review payment request.</p>

        <a href="${url}" class="action-trigger mt-32 mb-32">View Trip</a>
        <div class="note mt-32">
          <p>Ensure that the proof of loading is the same as what was descriped in the bid made by ${transporterName}.</p>
        </div>
      `,
      icon: icons.receipt,
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
      content: `
        <p class="content-paragraph">${transporterName} has updated his request for payment for a trip. Transporters require payment before they can proceed with the trip. Follow the link below to review payment request.</p>
        
        <a href="${url}" class="action-trigger mt-32 mb-32">View Trip</a>
        <div class="note mt-32">
          <p>Ensure that the proof of loading is the same as what was descriped in the bid made by ${transporterName}.</p>
        </div>
      `,
      icon: icons.receipt,
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
      title: 'Payment Rejected',
      content: `
        <p class="content-paragraph"><b>${tripOwnerName}</b> has rejected your payment request. To view his comment on the request, click the button below to see why your request was rejected and work on it.</p>

        <a href="${url}" class="action-trigger mt-32 mb-32">View Trip</a>
      `,
      icon: icons.receipt,
    })

    return this.sendMail(to, 'Your payment request has been rejected', template)
  }
  paymentRequestHasBeenApproved(
    to: string,
    url: string,
    tripOwnerName: string
  ) {
    const template = this.emailTemplate({
      title: 'Your money is on the way 🤑',
      content: `
        <p class="content-paragraph"><b>${tripOwnerName}</b> has approved your payment request therefore your money is on it's way to your account. If the money does not reflect in the next 1hr, kindly contact us via email support@gettruckdispatch.com or use the chat dialogue at the bottom of the page.</p>
        
        <a href="${url}" class="action-trigger mt-32 mb-32">Proceed with trip</a>
      `,
      icon: icons.receipt,
    })
    return this.sendMail(to, "Your money is on it's way", template)
  }
  tripHasBeenSetToInProgress(to: string, url: string, transporterName: string) {
    const template = this.emailTemplate({
      title: "Your  goods are on it's way",
      content: `
        <p class="content-paragraph"><b>${transporterName}</b> has started the trip, keep calm and expect your delivery soon.</p>
        
        <a href="${url}" class="action-trigger mt-32 mb-32">View Trip</a>
        <p class="content-paragraph">If you notice any issues with your trips, kindly reach out to our customer service and they would help you address any issues that exist.</p>
      `,
    })
    return this.sendMail(to, "Your  goods are on it's way", template)
  }
  tripHasBeenSetToCompleted(to: string, url: string, transporterName: string) {
    const template = this.emailTemplate({
      title: 'Your goods have arrived',
      content: `
        <p class="content-paragraph"><b>${transporterName}</b> has completed the trip. Thank you for choosing ${COMPANY_NAME}. Kindly help us rate <b>${transporterName}</b>, as it would help keep our platform safe</p>
        
        <a href="${url}" class="action-trigger mt-32 mb-32">Rate Transporter</a>
        <p class="content-paragraph">If the trip has not arrived yet, please inform the ${COMPANY_NAME} team to investigate immediately.</p>
      `,
    })

    return this.sendMail(to, 'Your goods have arrived', template)
  }
  tripHasBeenCanceledByTransporter(
    to: string,
    url: string,
    transporterName: string
  ) {
    const template = this.emailTemplate({
      title: `${transporterName} has cancelled the trip 😞`,
      content: `
        <p class="content-paragraph"><b>${transporterName}</b> has cancelled the trip 😞. However, you can reassign the trip to another transporter by viewing trip bids.</p>
        
        <a href="${url}" class="action-trigger mt-32 mb-32">View Trip bids</a>
        <p class="content-paragraph">The money paid to ${transporterName} has been reverted back to your account and can now be used to pay for your next trip or withdrawn.</p>
      `,
    })

    return this.sendMail(to, `${transporterName} has cancelled the trip 😞`, template)
  }
  tripHasBeenCanceledByShipper(
    to: string,
    url: string,
    shipperName: string
  ) {
    console.log(to);
    const template = this.emailTemplate({
      title: `${shipperName} has cancelled the trip 😞`,
      content: `
        <p class="content-paragraph"><b>${shipperName}</b> has cancelled the trip 😞.  In the mean time, feel free to look through the Job board to see other trips you may be eligible for</p>
        
        <a href="${url}" class="action-trigger mt-32 mb-32">View Other Jobs</a>
        <p class="content-paragraph">The team would look into the reason it was cancelled and get back to you if need be.</p>
      `,
    })

    return this.sendMail(to, `${shipperName} has cancelled the trip 😞`, template)
  }
}

export default new Mail()
