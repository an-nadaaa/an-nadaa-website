import Stripe from "stripe"

const stripe = new Stripe(useRuntimeConfig().STRIPE_SK as string)

/**
 * Fetches all active monthly subscriptions for a specific customer
 * @param customerId - The Stripe customer ID (e.g., 'cus_xxxxx')
 * @returns Promise with array of monthly subscriptions
 */
async function fetchMonthlySubscriptions(customerId: string) {
  try {
    // Fetch all subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active", // Only get active subscriptions
      limit: 10, // Adjust as needed
      // Stripe's API supports ordering subscriptions by created timestamp
      // Use 'created' descending so most recently created come first
    })

    // Filter for monthly subscriptions
    const monthlySubscriptions = subscriptions.data.filter((subscription) => {
      // Check if any of the subscription items have a monthly interval
      return subscription.items.data.some((item) => {
        return (
          item.price.recurring?.interval === "month" &&
          item.price.recurring?.interval_count === 1
        )
      })
    })

    return monthlySubscriptions
  } catch (error) {
    console.error("Error fetching monthly subscriptions:", error)
    throw error
  }
}

export default defineEventHandler(async (event: any) => {
  const { user } = await requireUserSession(event)
  const { stripeCustomerId } = user.user

  if (!stripeCustomerId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Stripe customer ID is required",
    })
  }
  // const monthlySubscriptions: any = []
  const monthlySubscriptions = await fetchMonthlySubscriptions(stripeCustomerId)

  // console.log(monthlySubscriptions)

  return {
    data: monthlySubscriptions,
    success: true,
  }

  // const query = await getValidatedQuery(event, monthlyDonationsQuerySchema.parse)
  // const { page = "1", pageSize = "20" } = query

  // const query = qs.stringify(
  //   {
  //     populate: "*",
  //   },
  // )
})
