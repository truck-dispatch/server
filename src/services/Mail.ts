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

  private emailTemplate({
    title,
    content,
    icon
  }: TemplateProps) {
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
      title: 'Password Reset',
      icon: icons.padlock,
      content: `
        <p>Someone (hopefully you) has requested a password reset for you Truckdispatch account. Click on the below button to continue to reset your password</p>
        <a href="${url}"><button class='email-action-button'>RESET PASSWORD</button></a>
        <p>If you don’t wish to reset your password, disregard this email and no action will be taken.</p>
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
      icon: icons.padlock
    })

    return this.sendMail(to, 'Reset Password', template)
  }

  verifyMail(to: string, url: string) {
    const template = this.emailTemplate({
      title: 'Verify Email',
      content: `
        <p>Welcome to ${COMPANY_NAME}; Follow the link below to verify your email</p>
        <a href="${url}"><button class='email-action-button'>VERIFY EMAIL</button></a>
        <p>This link expires in 1 day</p>
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
  transporterHasSentBid(to: string, transporterName: string, url: string, transporterAvatar?: string) {
    const template = this.emailTemplate({
      title: 'Bid Received',
      content: `
        <p>
          <b>${transporterName}</b> just sent a bid to your job. Click on the button below to view bid and negotiate or accept bid.
        </p>
        <div class="content-purple-info-container mt-32 mb-32 fit-content">

          <div class="item-label">Transporter Responsible</div>

          <div class="d-flex">
            <img src="${transporterAvatar || icons.avatar}" class="avatar" alt="user avatar">
            <div class="user-profile-details ml-8">
              <div>
                <div class="user-name truncate-word">${transporterName}</div>
                <div class="user-contact">************</div>
              </div>
              <a href="" class="secondary-btn ml-24 cta-button">View Profile</a>
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
      title: 'A bid has been updated.',
      content: `
        <p>${transporterName} just updated his bid to your job. Click on the button below to view the bid and negotiate or accept it.</p>
        <a href="${url}"><button class='email-action-button'>VIEW BID</button></a>
      `,
      icon: icons.truck
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
        <p>Your bid has been accepted for a trip going from ${pickUpLocation} to ${deliveryLocation} by ${tripOwnerName}. Kindly proceed to the dashboard to proceed with the trip.</p>
        <div class="content-purple-info-container mt-32 mb-32 fit-content">

          <div class="item-label">Transporter Responsible</div>

          <div class="d-flex">
            <img src="${tripOwnerAvatar || icons.avatar}" class="avatar" alt="user avatar">
            <div class="user-profile-details ml-8">
              <div>
                <div class="user-name truncate-word">${tripOwnerName}</div>
                <div class="user-contact">************</div>
              </div>
              <a href="" class="secondary-btn ml-24 cta-button">View Profile</a>
            </div>
          </div>
        </div>
        <a href="${url}"><button class='email-action-button'>VIEW TRIP</button></a>
        <p>Thank you for working with us.</p>
      `,
      icon: icons.truck
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
      title: 'Trip started',
      content: `
        <p>Your trip going from ${pickUpLocation} to ${deliveryLocation} by ${tripOwnerName} just started. Kindly proceed to the dashboard to view details on this trip.</p>
        <a href="${url}"><button class='email-action-button'>VIEW TRIP</button></a>
        <p>Thank you for working with us.</p>
      `,
      to,
    })

    return this.sendMail(to, 'Transporter has commenced the trip', template)
  }

  accountHasBeenVerifiedByAdmin(to: string, url: string) {
    const template = this.emailTemplate({
      title: 'Account Verified',
      content: `
        <p>Congratulations! Your profile has been successfully verified! 🎉 
We are thrilled to inform you that your account now carries the prestigious "Verified" badge, highlighting your authenticity and credibility within our community.</p>
        <a href="${url}"><button class='email-action-button'>VIEW PROFILE</button></a>
      `,
      to,
      icon: `<svg width="102" height="102" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="102" height="102" rx="51" fill="#D9D3F3"/>
<rect x="17" y="17" width="68" height="68" rx="34" fill="#B3A8E7"/>
<path d="M56.9358 36.8333H45.0641C39.9074 36.8333 36.8333 39.9075 36.8333 45.0642V56.9358C36.8333 60.9167 38.6608 63.6508 41.8766 64.685C42.8116 65.0108 43.8883 65.1667 45.0641 65.1667H56.9358C58.1116 65.1667 59.1883 65.0108 60.1233 64.685C63.3391 63.6508 65.1666 60.9167 65.1666 56.9358V45.0642C65.1666 39.9075 62.0924 36.8333 56.9358 36.8333ZM63.0416 56.9358C63.0416 59.9675 61.8516 61.88 59.4574 62.6733C58.0833 59.9675 54.8249 58.0408 50.9999 58.0408C47.1749 58.0408 43.9308 59.9533 42.5424 62.6733H42.5283C40.1624 61.9083 38.9583 59.9817 38.9583 56.95V45.0642C38.9583 41.0692 41.0691 38.9583 45.0641 38.9583H56.9358C60.9308 38.9583 63.0416 41.0692 63.0416 45.0642V56.9358Z" fill="#4326C4"/>
<path d="M51.0001 45.3333C48.1951 45.3333 45.9285 47.6 45.9285 50.405C45.9285 53.21 48.1951 55.4908 51.0001 55.4908C53.8051 55.4908 56.0718 53.21 56.0718 50.405C56.0718 47.6 53.8051 45.3333 51.0001 45.3333Z" fill="#4326C4"/>
</svg>
`,
    })

    return this.sendMail(to, 'Your account has been verified', template)
  }

  paymentHasBeenRequestedByTransporter(
    to: string,
    url: string,
    transporterName: string
  ) {
    const template = this.emailTemplate({
      title: 'Payment Requested',
      content: `
        <p>${transporterName} has requested payment for a trip. Transporters require payment before they can proceed with the trip. Click on the button below to review payment request.</p>
        <a href="${url}"><button class='email-action-button'>REVIEW PAYMENT REQUEST</button></a>
        <div class="note">
            <p>Ensure that the proof of loading is the same as what was descriped in the bid made by ${transporterName}.</p>
        </div>
      `,
      to,
      icon: `<svg width="102" height="102" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="102" height="102" rx="51" fill="#D9D3F3"/>
<rect x="17" y="17" width="68" height="68" rx="34" fill="#B3A8E7"/>
<path d="M43.9167 36.8333H42.5C38.25 36.8333 36.8334 39.3692 36.8334 42.5V43.9167V63.75C36.8334 64.9258 38.165 65.5917 39.1 64.8833L41.5225 63.07C42.0892 62.645 42.8825 62.7017 43.3925 63.2117L45.7442 65.5775C46.2967 66.13 47.2034 66.13 47.7559 65.5775L50.1359 63.1975C50.6317 62.7017 51.425 62.645 51.9775 63.07L54.4 64.8833C55.335 65.5775 56.6667 64.9117 56.6667 63.75V39.6667C56.6667 38.1083 57.9417 36.8333 59.5 36.8333H43.9167ZM49.9375 53.4792H43.5625C42.9817 53.4792 42.5 52.9975 42.5 52.4167C42.5 51.8358 42.9817 51.3542 43.5625 51.3542H49.9375C50.5184 51.3542 51 51.8358 51 52.4167C51 52.9975 50.5184 53.4792 49.9375 53.4792ZM51 47.8125H42.5C41.9192 47.8125 41.4375 47.3308 41.4375 46.75C41.4375 46.1692 41.9192 45.6875 42.5 45.6875H51C51.5809 45.6875 52.0625 46.1692 52.0625 46.75C52.0625 47.3308 51.5809 47.8125 51 47.8125Z" fill="#4326C4"/>
<path d="M59.5141 36.8333V38.9583C60.4491 38.9583 61.3416 39.3408 61.9933 39.9783C62.6733 40.6725 63.0416 41.565 63.0416 42.5V45.9283C63.0416 46.9767 62.5741 47.4583 61.5116 47.4583H58.7916V39.6808C58.7916 39.2842 59.1175 38.9583 59.5141 38.9583V36.8333ZM59.5141 36.8333C57.9416 36.8333 56.6666 38.1083 56.6666 39.6808V49.5833H61.5116C63.75 49.5833 65.1666 48.1667 65.1666 45.9283V42.5C65.1666 40.9417 64.5291 39.525 63.5091 38.4908C62.475 37.4708 61.0725 36.8475 59.5141 36.8333C59.5283 36.8333 59.5141 36.8333 59.5141 36.8333Z" fill="#4326C4"/>
</svg>
`,
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
        <p>${transporterName} has updated his request for payment for a trip. Transporters require payment before they can proceed with the trip. Follow the link below to review payment request.</p>
        <a href="${url}"><button class='email-action-button'>REVIEW PAYMENT REQUEST</button></a>
        <div class="note">
            <p>Ensure that the proof of loading is the same as what was descriped in the bid made by ${transporterName}.</p>
        </div>
      `,
      to,
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
        <p>${tripOwnerName} has rejected your payment request. To view his comment on the request, click the button below to see why your request was rejected and work on it.</p>
        <a href="${url}"><button class='email-action-button'>REVIEW PAYMENT REQUEST</button></a>
      `,
      to,
      icon: `<svg width="102" height="102" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="102" height="102" rx="51" fill="#D9D3F3"/>
<rect x="17" y="17" width="68" height="68" rx="34" fill="#B3A8E7"/>
<path d="M56.9358 36.8333H45.0641C39.9075 36.8333 36.8333 39.9075 36.8333 45.0642V56.9217C36.8333 62.0925 39.9075 65.1667 45.0641 65.1667H56.9216C62.0783 65.1667 65.1525 62.0925 65.1525 56.9358V45.0642C65.1666 39.9075 62.0925 36.8333 56.9358 36.8333ZM55.76 54.2583C56.1708 54.6692 56.1708 55.3492 55.76 55.76C55.5475 55.9725 55.2783 56.0717 55.0091 56.0717C54.74 56.0717 54.4708 55.9725 54.2583 55.76L51 52.5017L47.7416 55.76C47.5291 55.9725 47.26 56.0717 46.9908 56.0717C46.7216 56.0717 46.4525 55.9725 46.24 55.76C45.8291 55.3492 45.8291 54.6692 46.24 54.2583L49.4983 51L46.24 47.7417C45.8291 47.3308 45.8291 46.6508 46.24 46.24C46.6508 45.8292 47.3308 45.8292 47.7416 46.24L51 49.4983L54.2583 46.24C54.6691 45.8292 55.3491 45.8292 55.76 46.24C56.1708 46.6508 56.1708 47.3308 55.76 47.7417L52.5016 51L55.76 54.2583Z" fill="#4326C4"/>
</svg>
`,
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
        <p>${tripOwnerName} has approved your payment request therefore your money is on it's way to your account. If the money does not reflect in the next 1hr, kindly contact us via email support@gettruckdispatch.com or use the chat dialogue at the bottom of the page.</p>
        <a href="${url}"><button class='email-action-button'>PROCEED WITH TRIP</button></a>
      `,
      to,
      icon: `<svg width="102" height="102" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="102" height="102" rx="51" fill="#D9D3F3"/>
<rect x="17" y="17" width="68" height="68" rx="34" fill="#B3A8E7"/>
<path d="M61.1575 43.4067C60.5483 40.3325 58.2675 38.9867 55.0942 38.9867H42.6558C38.9158 38.9867 36.4225 40.8567 36.4225 45.22V52.5158C36.4225 55.6608 37.7117 57.5025 39.8367 58.2958C40.1483 58.4092 40.4883 58.5083 40.8425 58.565C41.4092 58.6925 42.0183 58.7492 42.6558 58.7492H55.1083C58.8483 58.7492 61.3417 56.8792 61.3417 52.5158V45.22C61.3417 44.5542 61.285 43.9592 61.1575 43.4067ZM41.8342 51C41.8342 51.5808 41.3525 52.0625 40.7717 52.0625C40.1908 52.0625 39.7092 51.5808 39.7092 51V46.75C39.7092 46.1692 40.1908 45.6875 40.7717 45.6875C41.3525 45.6875 41.8342 46.1692 41.8342 46.75V51ZM48.875 52.615C46.8067 52.615 45.135 50.9433 45.135 48.875C45.135 46.8067 46.8067 45.135 48.875 45.135C50.9433 45.135 52.615 46.8067 52.615 48.875C52.615 50.9433 50.9433 52.615 48.875 52.615ZM58.0267 51C58.0267 51.5808 57.545 52.0625 56.9642 52.0625C56.3833 52.0625 55.9017 51.5808 55.9017 51V46.75C55.9017 46.1692 56.3833 45.6875 56.9642 45.6875C57.545 45.6875 58.0267 46.1692 58.0267 46.75V51Z" fill="#4326C4"/>
<path d="M65.5917 49.47V56.7658C65.5917 61.1292 63.0983 63.0133 59.3442 63.0133H46.9058C45.8433 63.0133 44.8942 62.8575 44.0725 62.5458C43.4067 62.305 42.8258 61.9508 42.3583 61.4975C42.1033 61.2567 42.3017 60.8742 42.6558 60.8742H55.0942C60.3358 60.8742 63.4525 57.7575 63.4525 52.53V45.22C63.4525 44.88 63.835 44.6675 64.0758 44.9225C65.0392 45.9425 65.5917 47.43 65.5917 49.47Z" fill="#4326C4"/>
</svg>
`,
    })
    return this.sendMail(to, "Your money is on it's way", template)
  }
  tripHasBeenSetToInProgress(to: string, url: string, transporterName: string) {
    const template = this.emailTemplate({
      title: 'Trip has been placed in-progress',
      content: `
        <p>${transporterName} has started the trip, keep calm and expect your delivery soon.</p>
        <a href="${url}"><button class='email-action-button'>VIEW TRIP</button></a>
        <p>If you notice any issues with your trips, kindly reach out to our customer service and they would help you address any issues that exist.</p>
      `,
      to,
    })
    return this.sendMail(to, "Your  goods are on it's way", template)
  }
  tripHasBeenSetToCompleted(to: string, url: string, transporterName: string) {
    const template = this.emailTemplate({
      title: 'Your goods have arrived',
      content: `
        <p>${transporterName} has completed the trip. Thank you for choosing ${COMPANY_NAME}. Kindly help us rate ${transporterName}, as it would help keep our platform safe</p>
        <a href="${url}"><button class='email-action-button'>RATE TRANSPORTER</button></a>
        <p>If the trip has not arrived yet, please inform the ${COMPANY_NAME} team to investigate immediately.</p>
      `,
      to,
    })

    return this.sendMail(to, 'Your goods have arrived', template)
  }
}

export default new Mail()
