import {
  COMPANY_NAME,
  EMAIL_PASSWORD,
  FRONTEND_URL,
  NO_REPLY_EMAIL_ADDRESS,
} from '@common/privateKeys'
import nodemailer from 'nodemailer'
import { styles } from './mail/assets/styles'
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

async function getBase64(imgPath: string) {
  // Read the image file as a buffer
  const imagePath = path.join(__dirname, imgPath);
  const readFile = promisify(fs.readFile);
  const imageBuffer = await readFile(imagePath);

  // Convert the image buffer to base64 encoding
  const imageBase64 = imageBuffer.toString('base64');
}
interface TemplateProps {
  title: string
  content?: string;
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
    content,
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
          <div class="mail-card">
            <section>
              <h1>${title}</h1>
              ${content}
            </section>
          </div>
          <div class="info-container">
            <p class="the-truck-dispatch-team">
              The Truckdispatch Team.
            </p>
            <div class="truck-dispatch-socials">
              <span>Truckdispatch</span>
              <div>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Frame" clip-path="url(#clip0_3160_17274)">
              <path id="Vector" d="M22.1621 6.08082C21.3986 6.41852 20.589 6.6403 19.7601 6.73882C20.6338 6.21626 21.2878 5.39384 21.6001 4.42482C20.7801 4.91282 19.8811 5.25482 18.9441 5.43982C18.3147 4.7664 17.4804 4.31979 16.571 4.16941C15.6616 4.01903 14.728 4.17331 13.9153 4.60828C13.1026 5.04324 12.4564 5.73451 12.0772 6.57462C11.6979 7.41472 11.6068 8.3566 11.8181 9.25382C10.1552 9.17048 8.52838 8.73835 7.04334 7.98549C5.55829 7.23263 4.24818 6.17587 3.19805 4.88382C2.82634 5.52227 2.63101 6.24805 2.63205 6.98682C2.63205 8.43682 3.37005 9.71782 4.49205 10.4678C3.82806 10.4469 3.17869 10.2676 2.59805 9.94482V9.99682C2.59825 10.9625 2.93242 11.8984 3.5439 12.6459C4.15538 13.3933 5.00653 13.9063 5.95305 14.0978C5.33667 14.2649 4.69036 14.2895 4.06305 14.1698C4.32992 15.0011 4.85006 15.728 5.55064 16.2489C6.25123 16.7698 7.09718 17.0586 7.97005 17.0748C7.10253 17.7561 6.10923 18.2598 5.04693 18.557C3.98464 18.8542 2.87418 18.9391 1.77905 18.8068C3.69075 20.0363 5.91615 20.6889 8.18905 20.6868C15.8821 20.6868 20.0891 14.3138 20.0891 8.78682C20.0891 8.60682 20.0841 8.42482 20.0761 8.24682C20.8949 7.65499 21.6017 6.92184 22.1631 6.08182L22.1621 6.08082Z" fill="#6A7C94"/>
              </g>
              <defs>
              <clipPath id="clip0_3160_17274">
              <rect width="24" height="24" fill="white" transform="translate(0 0.424835)"/>
              </clipPath>
              </defs>
              </svg>
              
              </div>
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
      `
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
