import Stripe from "stripe"

const runtimeConfig = useRuntimeConfig()
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
  if (event.method === "POST") {
    const body = await readBody(event)
    const { user: userSession } = await getUserSession(event)

    const headers = {
      "Access-Control-Allow-Origin": BASE_URL, // Allow requests from our Strapi frontend
      "Access-Control-Allow-Headers": "Content-Type",
    }

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

    console.log("body", body)

    let productId

    // Create or retrieve customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    let customer
    let cause: any
    if (customers.data.length > 0) {
      customer = customers.data[0]
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        phone,
        payment_method: paymentMethodId,
      })
    }

    if (causeId !== "general") {
      productId = await fetch(
        `${STRAPI_BASE_URL}/causes/${causeId}?populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_KEY}`,
          },
        }
      )
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

    if (donationType === "monthly") {
      const subscription = await createMonthlyDonation(
        customer.id,
        amount / 100,
        {
          productId: productId || STRIPE_GENERAL_PRODUCT,
          causeId, // This is the document id
          id: cause?.id, // This is the strapi int id
          userId: userSession?.user?.id,
          causeTitle: cause?.title || "GENERAL DONATION",
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
        customer.id,
        amount / 100,
        {
          productId: productId || STRIPE_GENERAL_PRODUCT,
          causeId, // This is the document id
          id: cause?.id, // This is the strapi int id
          userId: userSession?.user?.id,
          causeTitle: cause?.title || "GENERAL DONATION",
        },
        productId || STRIPE_GENERAL_PRODUCT,
        currency.toLowerCase()
      )

      return {
        paymentIntentId: paymentIntent.paymentIntentId,
        clientSecret: paymentIntent.clientSecret,
      }
    }
  }
  // How to get method
  // event.method

  // How to throw errors
  // if (!Number.isInteger(id)) {
  //   throw createError({
  //     statusCode: 400,
  //     statusMessage: "ID should be an integer",
  //   })
  // }
})
