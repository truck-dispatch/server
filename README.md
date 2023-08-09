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
SMS_ACCOUNT_SID=AC2cf92a6ab8efd1b4f49e00002424f151
SMS_AUTH_TOKEN=cc190060af532150a1eb19704e402902
SMS_SERVICE_SID=VAdfcc82490cfd0bce4acc18fc882ed80d
JWT_SECRET=171d061b27577d9bcdd7152625d8b82ec3eae1126df1d2dba0c14b5ccce9732e
CLOUDINARY_IMAGE_UPLOAD_URL=https://api.cloudinary.com/v1_1/dh8mksait/image/upload
CLOUDINARY_VIDEO_UPLOAD_URL=https://api.cloudinary.com/v1_1/dh8mksait/video/upload
CLOUDINARY_UPLOAD_PRESET=ohojqqlt
CLOUDINARY_CLOUD_NAME=dpxb6epv3
CLOUDINARY_FOLDER_NAME=assets
CLOUDINARY_API_KEY=881124548816429
CLOUDINARY_API_SECRET=qI0qmJRxsMy7Jg5k1ZXoLqy96U4
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

### BASE ROUTE

```
https://api.gettruckdispatch.com
```
## AUTHENTICATION

### REGISTER

POST `/auth/join`

```
  {
    email: string,
    phone: string e.g (07046505102, +2347046505102, 7046505102),
    userType: string e.g ('transporter', 'transportCompany', 'shipper', 'company'),
    firstName: string,
    lastName: string,
    roleInCompany: string e.g ('CEO', 'manager', 'secretary', 'accountant')
  }
```

### VERIFY PHONE

POST `/auth/verify-phone`

```
  {
    phone: string e.g (07046505102, +2347046505102, 7046505102),
    pin: number e.g (1001, 1002, 1003)
  }
```

### REQUEST SMS

POST `/auth/request-sms`

If SMS expires or wasn't sent, this would be the ideal endpoint to use.

```
  {
    phone: string e.g (07046505102, +2347046505102, 7046505102)
  }
```


### LOGIN

POST `/auth/login`

```
  {
    email: string,
    password: string,
  }
```

