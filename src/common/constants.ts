export const shippingLines = [
  'Maersk line',
  'Cosco',
  'Zim',
  'mol',
  'Hapagllyod',
  'CMA',
  'ARKAS',
  'MSC',
  'OOCL',
]

export const typeOfGoods = ['container', 'cargo']

export const jobTypes = ['Empty', 'Import', 'Export']

export const sizeOfContainer = ['20ft', '2 By 20ft', '40ft', '45ft']
// Don't change the order of the statuses
export const tripStatus = [
  'awaiting-bid',
  'assigned',
  'in-progress',
  'completed',
]

export const clientUserTypes = ['shipper', 'company']

export const serviceBasedUserTypes = ['transporter', 'transportCompany']
export const userTypes = [...clientUserTypes, ...serviceBasedUserTypes]
export const rolesInACompany = ['CEO', 'manager', 'secretary', 'accountant']

export const paymentSources = ['balance', 'paystack']

export const DEFAULT_ADMIN_PASSWORD = 'admin12345'
export const referralCommisionForServiceBasedUsers = 3000
export const referralCommisionForClientBasedUsers = 5000

export const minPriceForReferralCommission = 150000
