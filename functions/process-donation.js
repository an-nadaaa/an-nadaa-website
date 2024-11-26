// Netlify Function (process-donation.js)
require("dotenv").config()
const STRIPE_SK =
  process.env.CONTEXT === "production"
    ? process.env.STRIPE_SK_PROD
    : process.env.STRIPE_SK_DEV
const BASE_URL =
  process.env.CONTEXT === "production"
    ? process.env.BASE_URL_PROD
    : process.env.BASE_URL_DEV
const STRIPE_GENERAL_PRODUCT =
  process.env.CONTEXT === "production"
    ? process.env.STRIPE_GENERAL_PRODUCT_ID_PROD
    : process.env.STRIPE_GENERAL_PRODUCT_ID_DEV

const stripe = require("stripe")(STRIPE_SK),
  headers = {
    "Access-Control-Allow-Origin": BASE_URL,
    "Access-Control-Allow-Headers": "Content-Type",
  }

export const handler = async (event) => {
  try {
    const {
      paymentMethodId,
      amount,
      email,
      name,
      phone,
      donationType,
      currency,
    } = JSON.parse(event.body)

    // Create or retrieve customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    let customer
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

    if (donationType === "monthly") {
      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product: STRIPE_GENERAL_PRODUCT,
              unit_amount: amount,
              recurring: {
                interval: "month",
              },
            },
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: {
          payment_method_types: ["card"],
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
      })

      return {
        statusCode: 200,
        body: JSON.stringify({
          subscriptionId: subscription.id,
          clientSecret:
            subscription.latest_invoice.payment_intent.client_secret,
        }),
      }
    } else {
      // stripe.
      // // Process one-time payment
      // const session = await stripe.checkout.sessions.create({
      //   payment_method_types: ["card"],
      //   line_items: [
      //     {
      //       price_data: {
      //         currency: currency.toLowerCase(),
      //         product: STRIPE_GENERAL_PRODUCT,
      //         unit_amount: amount,
      //       },
      //       quantity: 1,
      //     },
      //   ],
      //   mode: "payment",
      //   customer: customer.id,
      //   success_url: `${BASE_URL}/status`,
      //   // cancel_url: `${BASE_URL}/cancel`,
      // })

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // amount in cents
        currency: currency.toLowerCase(),
        payment_method: paymentMethodId,
        // confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      })

      return {
        statusCode: 200,
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        }),
      }
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
