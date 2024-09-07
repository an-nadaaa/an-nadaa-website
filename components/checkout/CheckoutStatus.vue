<template>
  <div class="container my-8 sm:my-32">
    <Card class="max-w-xl px-4 py-16 mx-auto shadow-lg sm:px-32">
      <img :src="success ? GreenCheck : RedError" class="w-32 mx-auto" />
      <h4 class="mt-8 text-2xl font-medium text-center">
        Transaction successful
      </h4>
      <p v-if="success" class="font-light text-center">
        Thank you! Your payment of
        <strong class="font-medium">
          {{ currency === "usd" ? "$" : "RM" }}{{ amount }}
        </strong>
        has been received.
      </p>
      <p v-else class="text-center">
        We are sorry your payment of
        <strong class="font-medium">
          {{ currency === "usd" ? "$" : "RM" }}{{ amount }}
        </strong>

        to ANNADAA Educational Foundation was unsuccessful
      </p>
      <NuxtLink to="/">
        <Button class="w-full mt-4">Goto home page</Button>
      </NuxtLink>
    </Card>
  </div>
</template>

<script setup lang="ts">
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
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
})
</script>
