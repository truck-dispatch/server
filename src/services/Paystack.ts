import axios from 'axios'
import { PAYSTACK_PRIVATE_KEY } from '../common/privateKeys'
import BankDetails from '../types/BankDetails'

const api = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${PAYSTACK_PRIVATE_KEY}`,
  },
})

class Paystack {
  loadBanks() {
    return api.get('/bank?currency=NGN').then(({ data }) => data.data)
  }
  loadAccountDetails(bankCode: string, accountNumber: string) {
    return api
      .get(
        `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
      )
      .then(({ data }) => data.data)
  }
  createTransferRecipient(
    details: BankDetails
  ): Promise<{ recipient_code: string; id: string }> {
    return api.post('/transferrecipient', details).then(({ data }) => data.data)
  }
  deleteTransferRecipient(recipientId: string) {
    return api.delete(`/transferrecipient/${recipientId}`)
  }
  makeTransfer(details: Record<string, string | number>) {
    return api.post('/transfer', details).then(({ data }) => data)
  }
}
export default new Paystack()
