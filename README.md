# Truckdispatch Server

This is the server application for the truckdispatch platform.

## SETUP

To properly run this server locally:

### INSTALL DEPENDENCIES

```
npm install
```

### ENVIRONMENT VARIABLES

Environment variables are where we store important keys or keys that could be changed based on the environment.
For the server to properly function, it requires these variables. To work with environment variables on the development environment, create a `.env` file in your root directory and in it, place the following data:

```
PORT=5000
MONGO_DB_URL=mongodb+srv://support:4rhoAUaYRBU7YMAZ@cluster0.uc9tzee.mongodb.net/?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3000
SMS_API_KEY=TL9voC259gtfxhYNEkGIXcF1FeKwaCWXajjMQUkW8IvNcjbxnVC7fGyM2RBVfO
SMS_API_URL=https://api.ng.termii.com/api
JWT_SECRET=171d061b27577d9bcdd7152625d8b82ec3eae1126df1d2dba0c14b5ccce9732e
CLOUDINARY_IMAGE_UPLOAD_URL=https://api.cloudinary.com/v1_1/dh8mksait/image/upload
CLOUDINARY_VIDEO_UPLOAD_URL=https://api.cloudinary.com/v1_1/dh8mksait/video/upload
CLOUDINARY_UPLOAD_PRESET=hvkq8snh
CLOUDINARY_CLOUD_NAME=dh8mksait
CLOUDINARY_FOLDER_NAME=prod
CLOUDINARY_API_KEY=621179513548461
CLOUDINARY_API_SECRET=L-0vsIxkkqdXrpEhmhtrIORG96U
PAYSTACK_PRIVATE_KEY=sk_test_1c16bbc1f932d4269d744f67211c30fab3961dda
EMAIL_PASSWORD=ebe_zs4f3gkNzi7Q
NO_REPLY_EMAIL_ADDRESS=no_reply@gettruckdispatch.com
COMPANY_NAME=Truckdispatch
```

### RUN SERVER WITHOUT HOT RELOAD (PROD)

```
npm run start
```

### RUN SERVER IN DEV MODE WITH HOT RELOAD

```
npm run dev
```

### RUN SERVER IN DEV MODE WINDOWS WITH HOT RELOAD

```
npm run dev-win
```

## AUTHENTICATION

### Register

POST {BASE_URL}/auth/join

Expected parameters

```
{
  firstName: string,
  lastName: string,
  email: [string, unique],
  phone: [string, unique],
  password: string,
  userType: 'shipper' | 'transporter' | 'company', | 'transportCompany'
}
```

### LOGIN

POST {BASE_URL}/auth/login

```
{
  email: string,
  password: string
}
```

When a phone number has not been verified, a text sms is sent to the User to verify his number. The user should not be redirected to the dashboard in this case. Instead, he should be directed to where he would verify his phone details.

### VERIFY PHONE

After registration is sent, we send text messages for users to verify their phone numbers.
They can confirm their code using the URL

POST {BASE_URL}/auth/verify-phone

```
{
  phone: string,
  pin: string,
  pin_id: string,
}
```

### REQUEST SMS

This should be triggered when the verification code has expired, or the verification code did not get to the user's phone

POST {BASE_URL}/auth/request-sms

```
{
  phone: string
}
```

### REQUEST RESET PASSWORD

POST {BASE_URL}/auth/request-reset-password

```
{
  email: string
}
```

### REQUEST VERIFICATION EMAIL

This sends an email to the logged in user for verification if the user has not been verified.

POST {BASE_URL}/auth/request-email-verification

```
{
  email: string
}
```

### VERIFY EMAIL

This requires sending the token gotten from the email. Before this can be triggered, the request verification must have been triggered to get the token in the mail

POST {BASE_URL}/auth/verify-email

```
{
  token: string
}
```

## BIDS

### CREATE BID

This is when a transporter sends a bid for a job.

POST {BASE_URL}/bids

```
{
  extraNotes?: string,
  price: string,
  presentLocation: string,
  driverName: string,
  truckPlateNumber: string,
  tripId: string,
}
```

### UPDATE BID SENT BY TRANSPORTER

PATCH {BASE_URL}/bids/:tripId

```
{
  extraNotes?: string,
  price?: string,
  presentLocation?: string,
  driverName?: string,
  truckPlateNumber?: string,
}
```

### GET ALL BIDS OF A TRIP BY TRIP OWNER

GET {BASE_URL}/bids/:tripId

### GET A TRANSPORTERS BID TO A TRIP

GET {BASE_URL}/bids/transporter-bid/:tripId

Only the transporter that created the bid can access the route

## CHATS

### CREATE OR FETCH CHAT LOG

POST {BASE_URL}/chat/log

```
{ 
  clientId: string,
  transporterId: string
}
```

### CREATE CHAT

POST {BASE_URL}/chat

For this, we need to first create a chat log to be able to attain our chatId.

```
{ 
  message: string,
  senderId: string,
  receiverId: string,
  chatId: string
}
```

### GET ALL USER CHAT

GET {BASE_URL}/chat

### MARK CHAT AS READ

PATCH {BASE_URL}/chat/:messageId


### FETCH CHAT LOGS OF A USER

GET {BASE_URL}/chat/logs


## EXTERNAL SERVICES

### GET LIST OF BANKS

GET {BASE_URL}/externals/banks

### GET USER BANK ACCOUNT DETAILS

GET {BASE_URL}/externals/banks/account


## PAYMENTS

### REQUEST PAYMENT FOR TRIP BY TRANSPORTER

POST {BASE_URL}/payment/request-payment/trip/:tripId

```
{ 
  proofVideo: File
}
```

### UPDATE PAYMENT REQUEST FOR TRIP BY TRANSPORTER

PATCH {BASE_URL}/payment/request-payment/trip/:tripId

```
{ 
  proofVideo: File
}
```

### GET PAYMENT REQUESTS OF A TRANSPORTER BY TRANSPORTER

GET {BASE_URL}/payment/payment-requests

### REJECT PAYMENT REQUEST OF TRANSPORTER

POST {BASE_URL}/payment/payment-request/trip/:tripId/reject/:paymentRequestId

```
{ 
  reasonForReject: string
}
```

### APPROVE PAYMENT REQUEST OF TRANSPORTER

POST {BASE_URL}/payment/payment-request/trip/:tripId/approve/:paymentRequestId

## RATINGS

### RATE USER

POST {BASE_URL}/rating

```
{
  comment: string,
  userRating: string,
  userRated: string,
  tripId: string,
  starRating: number
}
```

### GET TRIP RATING

GET {BASE_URL}/rating/:tripId

## TRIPS

### Create Trip

POST {BASE_URL}/trips

```
{
  pickUpAddress: string,
  deliveryAddress: string,
  pickUpDate: string,
  deliveryDate: string,
  typeOfGoods: 'container' | 'cargo',
  weight: string,
  sizeOfContainer?: string,
  shippingLine?: 'Maersk line' | 'Cosco' |'Zim' | 'mol' |'Hapagllyod' | 'CMA' | 'ARKAS' |'MSC' | OOCL',
  jobType: 'import' | 'export' | 'empty',
  instructions?: string,
}
```

### GET TRIPS

GET {BASE_URL}/trips

### UPDATE TRIP

PATCH {BASE_URL}/trips/:tripId

```
{
  pickUpAddress?: string,
  deliveryAddress?: string,
  pickUpDate?: string,
  deliveryDate?: string,
  typeOfGoods?: 'container' | 'cargo',
  weight?: string,
  sizeOfContainer?: string,
  shippingLine?: string ,
  jobType?: 'import' | 'export' | 'empty',
  instructions?: string,
}
```

### CHANGE TRIP STATUS

PATCH {BASE_URL}/trips/:tripId/change-status/:status

status can be either in-progress or completed

### ASSIGN TRIP

POST {BASE_URL}/trips/:tripId/assign-trip

```
{
  from: [string, 'tripOwnerId'],
  to: [string, 'transporterId'],
  tripId: string,
  bidId: string,
  paymentReference: [string, from_paystack],
  amountInBid: string,
  totalAmountPaid: number,
  transaction: [string, from_paystack],
}
```

### UPLOAD TDO BY TRIP OWNER

POST {BASE_URL}/trips/:tripId/upload-tdo

```
{
  TDO: File
}
```

## USERS

### GET LOGGED IN USER

GET {BASE_URL}/user

### UPDATE USER ACCOUNT

PATCH {BASE_URL}/user

This requires sending a FormData.

```
{ 
  firstName: string,
  lastName: string,
  avatar: File
}

```

### ADD/UPDATE USER ACCOUNT

PATCH {BASE_URL}/user/bank-details


```
{ 
  name: string,
  account_number: string,
  bank_code: string,
  bank_name: string
}

```

### CHANGE PASSWORD

PATCH {BASE_URL}/user/update-password


```
{ 
  password: string
}

```


