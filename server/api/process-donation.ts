import Stripe from "stripe"

export default defineEventHandler(async (event) => {
  if (event.method === "POST") {
    const body = await readBody(event)
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

    const stripe = new Stripe(STRIPE_SK as string),
      headers = {
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

    let productId = STRIPE_GENERAL_PRODUCT as string

    if (!causeId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cause ID is required",
      })
    }

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

    if (causeId !== "general" && !cause) {
      throw createError({
        statusCode: 404,
        statusMessage: "Cause not found",
      })
    }

    if (donationType === "monthly") {
      // todo: enable monthly donations

      return {
        headers,
        statusCode: 400,
        body: JSON.stringify({ error: "Monthly donations are disabled" }),
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product: productId || STRIPE_GENERAL_PRODUCT,
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
        subscriptionId: subscription.id,
        clientSecret: (
          (subscription?.latest_invoice as Stripe.Invoice)
            .payment_intent as Stripe.PaymentIntent
        ).client_secret,
      }
    } else {
      const causeDetails =
        causeId !== "general" ? { id: cause.id, causeTitle: cause.title } : null
      // Process one-time payment
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // amount in cents
          currency: currency.toLowerCase(),
          payment_method: paymentMethodId,
          // confirm: true,
          metadata: {
            productId,
            causeId,
            ...causeDetails,
          },
          customer: customer.id,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never",
          },
        })

        return {
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        }
      } catch (error: any) {
        console.log("ERROR: " + error.message)
        throw createError({
          statusCode: 500,
          statusMessage: error.message,
        })
      }

      // return {
      //   headers,
      //   statusCode: 200,
      //   body: JSON.stringify({
      //     paymentIntentId: paymentIntent.id,
      //     clientSecret: paymentIntent.client_secret,
      //   }),
      // }
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
