import { loadStripe } from "@stripe/stripe-js"
import type { Stripe } from "@stripe/stripe-js"

let stripeInstance: Stripe | null = null

export const useStripe = async () => {
  const { STRIPE_PK } = useRuntimeConfig().public

  if (!stripeInstance) {
    stripeInstance = await loadStripe(STRIPE_PK as string)
  }
  return stripeInstance
}
