<template>
  <div>
    <CheckoutStatus
      :amount="transactionDetails?.amount || 0"
      :currency="transactionDetails?.currency || 'usd'"
      :success="transactionDetails?.success || false"
      :is-subscription="isSubscription"
      :is-processing="isProcessing"
      :is-server-error="isServerError"
      :receipt-url="transactionDetails?.receiptUrl || ''"
    />
  </div>
</template>

<script setup lang="ts">
import Stripe from "stripe"

const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const id = route.query.id as string
if (!id) {
  throw createError({
    statusCode: 500,
    statusMessage: "No transaction ID provided",
    fatal: true,
  })
}
const isSubscription = id.startsWith("sub_")
const isProcessing = ref(true)
const interval = ref<NodeJS.Timeout | null>(null)
const transactionDetails = ref<{
  success: boolean
  amount?: number | null
  currency?: string | null
  receiptUrl?: string | null
}>()
const isServerError = ref(false)

onBeforeMount(async () => {
  interval.value = setInterval(async () => {
    const details: {
      paymentIntentStatus: Stripe.PaymentIntent.Status
      subscriptionStatus: Stripe.Subscription.Status
      amount?: number | null
      currency?: string | null
      receiptUrl: string
    } = await fetch("/api/transaction-status?id=" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) return res.json()
        else {
          isServerError.value = true
          transactionDetails.value = {
            success: false,
            amount: null,
            currency: null,
            receiptUrl: null,
          }
          isProcessing.value = false
        }

        interval.value && clearInterval(interval.value)
      })
      .catch((err) => {
        isServerError.value = true
        transactionDetails.value = {
          success: false,
          amount: null,
          currency: null,
          receiptUrl: null,
        }
        isProcessing.value = false

        interval.value && clearInterval(interval.value)
      })

    // console.log(details)

    if (details.paymentIntentStatus === "succeeded") {
      transactionDetails.value = {
        success: true,
        amount: details.amount,
        currency: details.currency,
        receiptUrl: details.receiptUrl || null,
      }
      isProcessing.value = false
    } else if (details.subscriptionStatus === "active") {
      transactionDetails.value = {
        success: true,
        amount: details.amount,
        currency: details.currency,
        receiptUrl: details.receiptUrl || null,
      }
      isProcessing.value = false
    } else if (
      details.paymentIntentStatus === "requires_payment_method" ||
      details.paymentIntentStatus === "requires_confirmation"
    ) {
      // Do nothing
    } else {
      transactionDetails.value = {
        success: false,
        amount: details.amount,
        currency: details.currency,
        receiptUrl: details.receiptUrl || null,
      }
      isProcessing.value = false
    }
  }, 1000)
})

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value)
  }
})
</script>
