import Stripe from "stripe"
const STRIPE_SK =
  process.env.CONTEXT === "production"
    ? process.env.STRIPE_SK_PROD
    : process.env.STRIPE_SK_DEV

const stripe = new Stripe(STRIPE_SK as string)
async function getPaymentIntentDetails(paymentIntentId: string) {
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

async function getSubscriptionDetails(subscriptionId: string) {
  try {
    // Retrieve the subscription object
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Retrieve the latest invoice related to the subscription
    const latestInvoice = await stripe.invoices.retrieve(
      subscription.latest_invoice as string
    )

    let paymentIntentStatus = null
    let amount = null
    let currency = null

    // Retrieve the PaymentIntent linked to this invoice if it exists
    if (latestInvoice.payment_intent) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        latestInvoice.payment_intent as string
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

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const id = query.id as string

  let response

  if (id.startsWith("sub_")) {
    response = await getSubscriptionDetails(id)
  } else if (id.startsWith("pi_")) {
    response = await getPaymentIntentDetails(id)
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request. Please provide a valid transaction ID.",
    })
    // return {
    //   statusCode: 400,
    //   headers,
    //   body: JSON.stringify({
    //     error:
    //       "Invalid request. Please provide a valid transaction ID in the query parameters.",
    //   }),
    // }
  }

  return response
  // return {
  //   statusCode: 200,
  //   headers,
  //   body: JSON.stringify(response),
  // }
})
