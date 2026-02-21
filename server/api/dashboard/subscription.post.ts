import Stripe from "stripe"
import { z } from "zod"

const config = useRuntimeConfig()
const stripe = new Stripe(config.STRIPE_SK as string)

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

/**
 * Fetch a Stripe subscription by ID, including metadata and optional customer expand.
 * Use subscription.metadata for cause info (e.g. causeId, causeTitle, userId).
 */
async function getSubscriptionWithMetadata(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["customer"],
  })
  return subscription
}

/**
 * Fetch user email from Strapi by user documentId (Strapi document id from subscription.metadata.userId).
 * Returns email or null if user not found or email missing.
 */
async function getEmailByStrapiDocumentId(
  documentId: string
): Promise<string | null> {
  const STRAPI_API = config.public.STRAPI_API
  const apiKey = config.STRAPI_API_KEY_BACKEND
  const url = `${STRAPI_API}/users?filters[documentId][$eq]=${encodeURIComponent(documentId)}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  })
  if (!res.ok) return null
  const data = await res.json().catch(() => null)
  const users = Array.isArray(data) ? data : data?.data ?? data?.results ?? []
  const user = users[0]
  const email = user?.email
  return typeof email === "string" && email.trim() ? email.trim() : null
}

function formatAmount(amountInCents: number, currency: string): string {
  const value = amountInCents / 100
  if (currency.toUpperCase() === "USD") return `$${value.toFixed(2)}`
  if (currency.toUpperCase() === "MYR") return `RM ${value.toFixed(2)}`
  return `${value.toFixed(2)} ${currency.toUpperCase()}`
}

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

async function sendDonationEmail(
  subscription: Stripe.Subscription,
  action: "pause" | "resume" | "cancel"
): Promise<void> {
  const metadata = subscription.metadata || {}
  const userId = metadata.userId as string | undefined
  if (!userId || !userId.trim()) {
    console.warn("[subscription.post] No userId in subscription metadata, skipping donation email")
    return
  }

  const email = await getEmailByStrapiDocumentId(userId.trim())
  if (!email) {
    console.warn(`[subscription.post] User not found or no email for documentId ${userId}, skipping donation email`)
    return
  }

  const causeId = (metadata.causeId as string) ?? ""
  const causeTitle = (metadata.causeTitle as string) ?? ""
  const causeThumbnailUrl = (metadata.causeThumbnailUrl as string) ?? ""
  const causeType =
    causeId === "general" ? "general" : causeTitle ? "project" : "general"

  const item = subscription.items.data[0]
  const amountFormatted = item?.plan?.amount != null && item?.plan?.currency
    ? formatAmount(item.plan.amount, item.plan.currency)
    : ""

  const emailType =
    action === "pause"
      ? "monthly_paused"
      : action === "resume"
        ? "monthly_resumed"
        : "monthly_cancelled"

  const body: Record<string, string | null | undefined> = {
    type: emailType,
    to: email,
    AMOUNT: amountFormatted,
    causeType,
    causeTitle: causeTitle || (causeId === "general" ? "General Donation" : undefined),
    causeThumbnailUrl: causeThumbnailUrl || null,
  }

  if (emailType === "monthly_cancelled") {
    body.ACTIVE_UNTIL_DATE =
      subscription.current_period_end != null
        ? formatDate(subscription.current_period_end)
        : ""
  }

  if (emailType === "monthly_paused") {
    const resumesAt = (subscription as Stripe.Subscription & { pause_collection?: { resumes_at?: number } }).pause_collection?.resumes_at
    body.RESUME_DATE = resumesAt != null ? formatDate(resumesAt) : ""
  }

  const STRAPI_API = config.public.STRAPI_API
  const apiKey = config.STRAPI_API_KEY_BACKEND
  const res = await fetch(`${STRAPI_API}/donation-emails/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error("[subscription.post] Donation email send failed:", res.status, err)
  }
}

const bodySchema = z.object({
  subscriptionId: z.string(),
  action: z.enum(["pause", "resume", "cancel"]),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)
  const { subscriptionId, action } = body

  let result: Stripe.Subscription
  switch (action) {
    case "pause":
      result = await pauseSubscription(subscriptionId)
      break
    case "resume":
      result = await resumeSubscription(subscriptionId)
      break
    case "cancel":
      result = await stopSubscriptionImmediately(subscriptionId)
      break
  }

  const subscription = await getSubscriptionWithMetadata(subscriptionId)
  await sendDonationEmail(subscription, action).catch((err) => {
    console.error("[subscription.post] sendDonationEmail error:", err)
  })

  return result
})
