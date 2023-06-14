import twilio from "twilio";
import { SMS_AUTH_TOKEN, SMS_ACCOUNT_SID, SMS_SERVICE_SID } from '@common/privateKeys';
const client = twilio(SMS_ACCOUNT_SID, SMS_AUTH_TOKEN);

interface SendOTPParams {
  to: string
}

class Sms {
  sendOTP({
    to
  }: SendOTPParams) {
    return client.verify.v2.services(SMS_SERVICE_SID!)
      .verifications
      .create({ to, channel: 'sms' })
  }

  verifyOTP(to: string, pin: string) {
    return client.verify.v2.services(SMS_SERVICE_SID!)
      .verificationChecks
      .create({ to, code: pin })
  }
}

const sms = new Sms()

export default sms
