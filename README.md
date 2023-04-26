# Truckdispatch Server

This is the server application for the truckdispatch platform.

# SETUP

To properly run this server locally:

## INSTALL DEPENDENCIES

```
npm install
```

## RUN SERVER WITHOUT HOT RELOAD (PROD)

```
npm run start
```

## RUN SERVER IN DEV MODE WITH HOT RELOAD

```
npm run dev
```

# AUTHENTICATION

## Register

POST {BASE_URL}/auth/join

Expected parameters

```
{
  email: string,
  password: string,
  phone: string,
  userType: 'agent' | 'transporter' | 'company', | 'transportCompany'
  firstName,
  lastName,
}
```

## LOGIN

POST {BASE_URL}/auth/login

```
{
  email: string,
  password: string
}
```

When a phone number has not been verified, a text sms is sent to the User to verify his number. The user should not be redirected to the dashboard in this case. Instead, he should be directed to where he would verify his phone details.

## VERIFY PHONE

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

## REQUEST SMS

This should be triggered when the verification code has expired, or the verification code did not get to the user's phone

POST {BASE_URL}/auth/request-sms

```
{
  phone: string
}
```

# TRIPS

## Create Trip

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
  shippingLine?: string ,
  jobType: 'import' | 'export' | 'empty',
  instructions?: string,
}
```

## GET TRIPS

GET {BASE_URL}/trips

## UPDATE TRIP

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
