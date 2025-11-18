import Stripe from "stripe"
import { z } from "zod"

const stripe = new Stripe(useRuntimeConfig().STRIPE_SK as string)

/**
 * Pause a subscription
 * Pauses collection of payments while keeping the subscription active
 * @param subscriptionId - The Stripe subscription ID
 * @param options - Pause configuration options
 * @returns Promise with the paused subscription
 */
async function pauseSubscription(
  subscriptionId: string,
  options?: {
    behavior?: "mark_uncollectible" | "keep_as_draft" | "void"
    resumesAt?: Date // Optional: automatically resume at this date
  }
) {
  try {
    const pauseConfig: Stripe.SubscriptionUpdateParams = {
      pause_collection: {
        behavior: options?.behavior || "void", // 'void' cancels invoices, 'keep_as_draft' keeps them
        resumes_at: options?.resumesAt
          ? Math.floor(options.resumesAt.getTime() / 1000)
          : undefined,
      },
    }

    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      pauseConfig
    )

    console.log("Subscription paused:", subscription.id)
    console.log("Pause collection:", subscription.pause_collection)

    return subscription
  } catch (error) {
    console.error("Error pausing subscription:", error)
    throw error
  }
}

/**
 * Resume a paused subscription
 * Resumes payment collection for a paused subscription
 * @param subscriptionId - The Stripe subscription ID
 * @returns Promise with the resumed subscription
 */
async function resumeSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: null, // Setting to null resumes the subscription
    })

    console.log("Subscription resumed:", subscription.id)
    console.log("Status:", subscription.status)

    return subscription
  } catch (error) {
    console.error("Error resuming subscription:", error)
    throw error
  }
}

/**
 * Stop (cancel) a subscription immediately
 * Customer loses access immediately
 * @param subscriptionId - The Stripe subscription ID
 * @param options - Cancellation options
 * @returns Promise with the canceled subscription
 */
async function stopSubscriptionImmediately(
  subscriptionId: string,
  options?: {
    prorate?: boolean // Issue credit for unused time
    invoiceNow?: boolean // Create invoice immediately
  }
) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId, {
      prorate: options?.prorate || false,
      invoice_now: options?.invoiceNow || false,
    })

    console.log("Subscription stopped immediately:", subscription.id)
    console.log("Status:", subscription.status) // 'canceled'
    console.log("Canceled at:", new Date(subscription.canceled_at! * 1000))

    return subscription
  } catch (error) {
    console.error("Error stopping subscription:", error)
    throw error
  }
}

const bodySchema = z.object({
  subscriptionId: z.string(),
  action: z.enum(["pause", "resume", "cancel"]),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)
  const { subscriptionId, action } = bodySchema.parse(body)

  switch (action) {
    case "pause":
      return await pauseSubscription(subscriptionId)
    case "resume":
      return await resumeSubscription(subscriptionId)
    case "cancel":
      return await stopSubscriptionImmediately(subscriptionId)
  }
})
