import { SMS_API_KEY, SMS_API_URL } from '../common/privateKeys'
import ApiService from './ApiService'

type SMSType = 'NUMERIC' | 'ALPHANUMERIC'

interface SendOTPParams {
  to: string
  message_text?: string
  message_type?: SMSType
  from?: string
  pin_attempts?: number
  pin_time_to_live?: number
  pin_length?: number
  channel?: 'dnd' | 'generic' | 'email' | 'WhatsApp'
  pin_placeholder?: string
}
const Api = new ApiService(SMS_API_URL!)
class Sms {
  sendOTP({
    to,
    message_text = 'Your TruckDispatch verification code is < 123456 >. This is a one time pin and it expires in 60 minutes.',
    message_type = 'NUMERIC',
    from = 'N-Alert',
    pin_attempts = 10,
    pin_length = 6,
    pin_time_to_live = 60,
    channel = 'dnd',
    pin_placeholder = '< 123456 >',
  }: SendOTPParams) {
    const data = {
      api_key: SMS_API_KEY,
      message_type,
      to: to.replace(/^0/, '234'),
      from,
      message_text,
      channel,
      pin_attempts,
      pin_length,
      pin_time_to_live,
      pin_placeholder,
    }

    return Api.post('/sms/otp/send', data)
  }

  verifyOTP(pin_id: string, pin: string) {
    return Api.post('/sms/otp/verify', {
      api_key: SMS_API_KEY,
      pin_id,
      pin,
    })
  }
}

const sms = new Sms()

export default sms
