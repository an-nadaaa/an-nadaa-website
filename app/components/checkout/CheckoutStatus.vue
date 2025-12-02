<template>
  <div class="container my-8">
    <Card class="px-4 py-16 mx-auto max-w-xl shadow-lg sm:px-32">
      <template v-if="isProcessing">
        <div>
          <VueSpinnerClock class="mx-auto text-[100px] text-gray-500" />
          <h4 class="mt-8 text-2xl font-medium text-center">
            Processing payment
          </h4>
          <p class="font-light text-center">
            Please wait while we process your payment
          </p>
        </div>
      </template>
      <template v-else>
        <img
          :src="success && !isServerError ? GreenCheck : RedError"
          class="mx-auto w-32"
        />
        <template v-if="isServerError">
          <h4 class="mt-8 text-2xl font-medium text-center">Server error!</h4>
          <p class="mt-4 font-light text-center">
            Your donation may or may not have been processed. Please check your
            bank statement to verify, else you may contact us.
          </p>
        </template>
        <template v-else>
          <h4 class="mt-8 text-2xl font-medium text-center">
            {{ success ? "Payment successful" : "Payment unsuccessful" }}
          </h4>
          <p v-if="success" class="mt-4 font-light text-center">
            <template v-if="!isSubscription">
              Thank you! Your payment of
              <strong class="font-medium">
                {{ currency === "usd" ? "$" : "RM" }}{{ amount / 100 }}
              </strong>
              has been received.
            </template>
            <template v-else>
              Thank you! Your monthly donation of
              <strong class="font-medium">
                {{ currency === "usd" ? "$" : "RM" }}{{ amount / 100 }}
              </strong>
              has started.
            </template>
          </p>
          <p v-else class="text-center">
            <template v-if="amount > 0">
              We are sorry your payment of
              <strong class="font-medium">
                {{ currency === "usd" ? "$" : "RM" }}{{ amount }}
              </strong>

              to ANNADAA Educational Foundation was unsuccessful
            </template>
            <template v-else>
              Sorry, we were not able to process your donation
            </template>
          </p>
        </template>
        <NuxtLink :href="receiptUrl" target="_blank">
          <Button class="mt-4 w-full" variant="outline">View receipt</Button>
        </NuxtLink>
        <NuxtLink :to="$localePath('/')">
          <Button class="mt-2 w-full">Goto home page</Button>
        </NuxtLink>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { VueSpinnerClock } from "vue3-spinners"
import GreenCheck from "~/assets/media/img/green-check.png"
import RedError from "~/assets/media/img/red-error.svg"

defineProps({
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  isServerError: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
  isSubscription: {
    type: Boolean,
    required: true,
  },
  isProcessing: {
    type: Boolean,
    required: true,
  },
  receiptUrl: {
    type: String,
    required: true,
  },
})
</script>
