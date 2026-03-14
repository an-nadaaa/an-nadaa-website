import Stripe from "stripe"
import { z } from "zod"

const stripe = new Stripe(useRuntimeConfig().STRIPE_SK as string)

const bodySchema = z.object({
  sourceTransactionIds: z.array(z.string()).max(100),
})

type DisplayStatus = "active" | "paused" | "cancelled"

async function resolveSubscriptionId(
  sourceTransactionId: string
): Promise<string | null> {
  try {
    if (sourceTransactionId.startsWith("in_")) {
      const invoice = await stripe.invoices.retrieve(sourceTransactionId)
      const sub = invoice.subscription
      return typeof sub === "string" ? sub : sub?.id ?? null
    }
    if (sourceTransactionId.startsWith("pi_")) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        sourceTransactionId,
        { expand: ["invoice"] }
      )
      const invoice = paymentIntent.invoice
      if (!invoice) return null
      const invoiceObj =
        typeof invoice === "string"
          ? await stripe.invoices.retrieve(invoice)
          : invoice
      const sub = invoiceObj.subscription
      return typeof sub === "string" ? sub : sub?.id ?? null
    }
    return null
  } catch {
    return null
  }
}

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readBody(event)
  const { sourceTransactionIds } = bodySchema.parse(body)

  const statuses: Record<string, DisplayStatus> = {}

  if (sourceTransactionIds.length === 0) {
    return { statuses }
  }

  const txToSubId = new Map<string, string | null>()
  for (const txId of sourceTransactionIds) {
    const subId = await resolveSubscriptionId(txId)
    txToSubId.set(txId, subId)
  }

  const uniqueSubIds = [
    ...new Set([...txToSubId.values()].filter((id): id is string => id != null)),
  ]

  const subStatuses = new Map<
    string,
    { status: string; pause_collection: Stripe.Subscription["pause_collection"] }
  >()
  for (const subId of uniqueSubIds) {
    try {
      const sub = await stripe.subscriptions.retrieve(subId)
      subStatuses.set(subId, {
        status: sub.status,
        pause_collection: sub.pause_collection,
      })
    } catch {
      subStatuses.set(subId, { status: "canceled", pause_collection: null })
    }
  }

  for (const txId of sourceTransactionIds) {
    const subId = txToSubId.get(txId) ?? null
    if (!subId) {
      statuses[txId] = "cancelled"
      continue
    }
    const info = subStatuses.get(subId)
    if (!info || info.status === "canceled" || info.status === "cancelled") {
      statuses[txId] = "cancelled"
      continue
    }
    if (info.status === "active" && info.pause_collection) {
      statuses[txId] = "paused"
      continue
    }
    if (info.status === "active") {
      statuses[txId] = "active"
      continue
    }
    statuses[txId] = "cancelled"
  }

  return { statuses }
})
