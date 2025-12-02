import Stripe from "stripe"
import { strapi } from "@strapi/client"

const runtimeConfig = useRuntimeConfig()
const client = strapi({
  baseURL: runtimeConfig.public.STRAPI_API,
  auth: runtimeConfig.public.STRAPI_API_KEY,
})

// Netlify Function (process-donation.js)
const STRIPE_SK =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SK_PROD
    : process.env.STRIPE_SK_DEV
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.BASE_URL_PROD
    : process.env.BASE_URL_DEV
const STRIPE_GENERAL_PRODUCT =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_GENERAL_PRODUCT_ID_PROD
    : process.env.STRIPE_GENERAL_PRODUCT_ID_DEV
const STRAPI_BASE_URL = runtimeConfig.public.STRAPI_API
const STRAPI_API_KEY = runtimeConfig.public.STRAPI_API_KEY

const stripe = new Stripe(STRIPE_SK as string)

async function createOneTimeDonation(
  customerId: string,
  donationAmount: number,
  metadata: any = {},
  productId = STRIPE_GENERAL_PRODUCT as string,
  currency = "usd"
) {
  // Create a one-time price for this donation
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: donationAmount * 100, // Convert dollars to cents
    currency: currency,
    nickname: `One-time donation: $${donationAmount}`,
  })

  // Create a payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: donationAmount * 100,
    currency: currency,
    customer: customerId,
    payment_method_types: ["card"],
    description: `One-time donation of $${donationAmount}`,
    metadata,
  })

  console.log(`✅ Payment Intent created for $${donationAmount}`)

  return {
    clientSecret: paymentIntent.client_secret as string,
    paymentIntentId: paymentIntent.id,
    amount: donationAmount,
    priceId: price.id,
  }
}

export type StripeTransactionMetadata = {
  productId: string
  causeId: string // This is the strapi cause document id
  id: number // This is the strapi cause int id
  userId?: string // This is the strapi user document id
  causeTitle: string
  causeThumbnailUrl: string
}

async function createMonthlyDonation(
  customerId: string,
  donationAmount: number,
  metadata: any = {},
  productId = STRIPE_GENERAL_PRODUCT as string,
  currency = "usd"
) {
  // Create a unique price for this customer's chosen amount
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: donationAmount * 100,
    currency: currency,
    recurring: {
      interval: "month",
    },
    nickname: `Custom ${donationAmount} USD/month`,
  })

  // Create subscription with the custom price
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: price.id }],
    payment_behavior: "default_incomplete",
    payment_settings: {
      payment_method_types: ["card"],
      save_default_payment_method: "on_subscription",
    },
    metadata,
    expand: ["latest_invoice.payment_intent"],
  })

  console.log(`✅ Subscription created for $${donationAmount}/month`)

  if (!subscription.latest_invoice) {
    throw createError({
      statusCode: 500,
      statusMessage: "Unable to create subscription",
    })
  }

  if (!(subscription.latest_invoice as Stripe.Invoice).payment_intent) {
    throw createError({
      statusCode: 500,
      statusMessage: "Unable to create subscription",
    })
  }
  // Extract the client secret from the payment intent
  const paymentIntent = (subscription.latest_invoice as Stripe.Invoice)
    .payment_intent as Stripe.PaymentIntent

  return {
    subscriptionId: subscription.id,
    clientSecret: paymentIntent.client_secret,
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userSession = await getUserSession(event)
  let customerId = userSession?.user?.user?.stripeCustomerId as string

  const {
    paymentMethodId,
    amount,
    email,
    name,
    phone,
    donationType,
    causeId,
    currency,
  } = body

  if (userSession.user) {
    if (!userSession?.user?.user?.stripeCustomerId) {
      await stripe.customers.create({
        email: userSession?.user?.user?.email,
        name: userSession?.user?.user?.username,
      })

      await fetch(`${STRAPI_BASE_URL}/users/${userSession?.user?.user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_KEY}`,
        },
        body: JSON.stringify({
          stripeCustomerId: customerId as string,
        }),
      }).then((res) => {
        if (res.ok) {
          console.log("User updated")
        } else {
          throw createError({
            statusCode: 500,
            statusMessage: "Unable to update user",
          })
        }
      })

      // userSession.user.stripeCustomerId = customerId as string
      await setUserSession(event, {
        ...userSession,
        user: {
          ...userSession?.user,
          user: {
            ...userSession?.user?.user,
            stripeCustomerId: customerId as string,
          },
        },
      })
    }
  } else {
    customerId = await stripe.customers
      .create({
        email: email,
        name: name,
        phone: phone,
      })
      .then((res) => res.id)
  }

  const headers = {
    "Access-Control-Allow-Origin": BASE_URL, // Allow requests from our Strapi frontend
    "Access-Control-Allow-Headers": "Content-Type",
  }

  // console.log("body", body)

  let productId
  let cause: any

  if (causeId !== "general") {
    productId = await fetch(`${STRAPI_BASE_URL}/causes/${causeId}?populate=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_KEY}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          cause = (await res.json()).data
          let id = cause.product
          if (!id) {
            throw new Error("Product not found")
          }

          if (!cause.isActive) {
            throw new Error("Cause is not active")
          }

          if (new Date(cause.startsAt) > new Date()) {
            throw new Error("Cause has not started yet")
          }

          if (cause.endsAt && new Date() > new Date(cause.endsAt)) {
            throw new Error("Cause has ended")
          }

          if (
            cause.causeType === "campaign" &&
            cause.goalDetails[0].endsAt &&
            new Date(cause.goalDetails[0].endsAt) < new Date()
          ) {
            throw new Error("Campaign has ended")
          }

          return id
        } else {
          // Create a custom error with the status code
          // const error = new Error(`HTTP Error: ${response.status}`)
          // error.status = response.status // Attach the status code to the error
          // throw error

          throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
          })
        }
      })
      .catch((error) => {
        if (error.status === 404) {
          throw createError({
            statusCode: 404,
            statusMessage: "Cause not found",
          })
        } else {
          throw new Error(error.message)
        }
      })
  }

  const metadata: StripeTransactionMetadata = {
    productId: productId || STRIPE_GENERAL_PRODUCT,
    causeId, // This is the strapi cause document id
    id: cause?.id, // This is the strapi cause int id
    userId: userSession?.user?.user?.documentId, // This is the strapi user int id
    causeTitle: cause?.title || "General Donation",
    causeThumbnailUrl: cause?.thumbnail?.formats?.thumbnail?.url,
  }

  if (donationType === "monthly") {
    const subscription = await createMonthlyDonation(
      customerId,
      amount / 100,
      {
        ...metadata,
      },
      productId || STRIPE_GENERAL_PRODUCT,
      currency.toLowerCase()
    )

    return {
      subscriptionId: subscription.subscriptionId,
      clientSecret: subscription.clientSecret,
    }
  } else {
    // Process one-time payment
    const paymentIntent = await createOneTimeDonation(
      customerId,
      amount / 100,
      {
        ...metadata,
      },
      productId || STRIPE_GENERAL_PRODUCT,
      currency.toLowerCase()
    )

    return {
      paymentIntentId: paymentIntent.paymentIntentId,
      clientSecret: paymentIntent.clientSecret,
    }
  }
})
