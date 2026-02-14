import Stripe from "stripe"
import { z } from "zod"

const stripe = new Stripe(useRuntimeConfig().STRIPE_SK as string)

const querySchema = z.object({
  sourceTransactionId: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const query = await getValidatedQuery(event, querySchema.parse)
  const { sourceTransactionId } = query

  try {
    if (sourceTransactionId.startsWith("in_")) {
      const invoice = await stripe.invoices.retrieve(sourceTransactionId)
      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id ?? null
      return { subscriptionId }
    }

    if (sourceTransactionId.startsWith("pi_")) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        sourceTransactionId,
        { expand: ["invoice"] }
      )
      const invoice = paymentIntent.invoice
      if (!invoice) return { subscriptionId: null }
      const invoiceObj =
        typeof invoice === "string"
          ? await stripe.invoices.retrieve(invoice)
          : invoice
      const subscriptionId =
        typeof invoiceObj.subscription === "string"
          ? invoiceObj.subscription
          : invoiceObj.subscription?.id ?? null
      return { subscriptionId }
    }

    return { subscriptionId: null }
  } catch (error) {
    console.error("Error resolving subscription by transaction:", error)
    return { subscriptionId: null }
  }
})
