const STRIPE_SK =
  process.env.CONTEXT === "production"
    ? process.env.STRIPE_SK_PROD
    : process.env.STRIPE_SK_DEV
const BASE_URL =
  process.env.CONTEXT === "production"
    ? process.env.BASE_URL_PROD
    : process.env.BASE_URL_DEV

const stripe = require("stripe")(STRIPE_SK),
  headers = {
    "Access-Control-Allow-Origin": BASE_URL,
    "Access-Control-Allow-Headers": "Content-Type",
  }

async function getPaymentIntentDetails(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return {
      paymentIntentStatus: paymentIntent.status, // possible values: succeeded, requires_action, requires_payment_method
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    }
  } catch (error) {
    console.error("Error retrieving Payment Intent:", error)
    return {
      error: error,
    }
  }
}

async function getSubscriptionDetails(subscriptionId) {
  try {
    // Retrieve the subscription object
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Retrieve the latest invoice related to the subscription
    const latestInvoice = await stripe.invoices.retrieve(
      subscription.latest_invoice
    )

    let paymentIntentStatus = null
    let amount = null
    let currency = null

    // Retrieve the PaymentIntent linked to this invoice if it exists
    if (latestInvoice.payment_intent) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        latestInvoice.payment_intent
      )

      paymentIntentStatus = paymentIntent.status
      amount = paymentIntent.amount
      currency = paymentIntent.currency
    }

    return {
      subscriptionStatus: subscription.status, // possible values: active, past_due, canceled
      amount,
      currency,
      paymentIntentStatus,
    }
  } catch (error) {
    console.error("Error retrieving Subscription details:", error)
    return {
      error: error,
    }
  }
}

export const handler = async (event) => {
  try {
    // console.log(event)

    const { id } = event.queryStringParameters

    let response

    if (id.startsWith("sub_")) {
      response = await getSubscriptionDetails(id)
    } else if (id.startsWith("pi_")) {
      response = await getPaymentIntentDetails(id)
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error:
            "Invalid request. Please provide a valid transaction ID in the query parameters.",
        }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "An error occurred while processing your request.",
      }),
    }
  }
}
