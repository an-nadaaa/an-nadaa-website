<template>
  <div class="flex items-center w-screen h-96">
    <div class="container max-w-lg">
      <template v-if="!hasToken">
        <img
          class="mx-auto w-14"
          src="assets/media/img/icons/key.svg"
          alt=""
        >
        <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
          Invalid link
        </h2>
        <p class="mt-3 text-center text-gray-500">
          This email change link is invalid or incomplete. Please request a new link from your account settings.
        </p>
        <NuxtLink to="/login">
          <div class="relative pt-6 mx-auto w-fit">
            <Icon
              class="absolute left-0 bottom-px text-gray-500"
              name="lucide:arrow-left"
            />
            <p class="pl-6 text-sm text-center text-gray-500">Back to log in</p>
          </div>
        </NuxtLink>
      </template>

      <template v-else-if="isLoading">
        <img
          class="mx-auto w-14"
          src="assets/media/img/icons/email.svg"
          alt=""
        >
        <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
          Verifying your email
        </h2>
        <p class="mt-3 text-center text-gray-500">
          Please wait while we update your email address.
        </p>
        <div class="flex justify-center mt-6">
          <span class="inline-block w-8 h-8 rounded-full border-2 border-gray-300 animate-spin border-t-gray-600" />
        </div>
      </template>

      <template v-else-if="success">
        <img
          class="mx-auto w-14"
          src="assets/media/img/icons/email.svg"
          alt=""
        >
        <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
          Email updated
        </h2>
        <p class="mt-3 text-center text-gray-500">
          Your email address has been updated successfully. You can now log in with your new email.
        </p>
        <NuxtLink v-if="!loggedIn" to="/login">
          <Button class="mt-8 w-full">Log in</Button>
        </NuxtLink>
        <NuxtLink v-else to="/dashboard">
          <Button class="mt-8 w-full">Go to dashboard</Button>
        </NuxtLink>
      </template>

      <template v-else>
        <img
          class="mx-auto w-14"
          src="assets/media/img/icons/key.svg"
          alt=""
        >
        <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
          Unable to update email
        </h2>
        <p class="mt-3 text-center text-gray-500">
          {{ errorMessage }}
        </p>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "login",
})

import { Button } from "@/components/ui/button"

const { loggedIn } = useUserSession()
const route = useRoute()
const token = computed(() => {
  const t = route.query.emailChangeToken
  return typeof t === "string" && t.trim() ? t.trim() : null
})
const hasToken = computed(() => !!token.value)

const isLoading = ref(true)
const success = ref(false)
const errorMessage = ref("")

onMounted(async () => {
  if (!token.value) {
    isLoading.value = false
    return
  }

  try {
    await $fetch("/api/email-change/verify", {
      method: "GET",
      query: { emailChangeToken: token.value },
    })
    success.value = true
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; statusMessage?: string; statusCode?: number }
    const msg = err?.data?.message ?? err?.statusMessage ?? "Something went wrong. Please try again."
    if (err?.statusCode === 400 && (msg.toLowerCase().includes("expired") || err?.statusMessage?.toLowerCase().includes("expired"))) {
      errorMessage.value = "This link has expired. Please request a new email change from your account settings."
    } else if (err?.statusCode === 404 || (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("already been used"))) {
      errorMessage.value = "This link is invalid or has already been used."
    } else if (err?.statusCode === 400 && (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("registered"))) {
      errorMessage.value = "This email address is already registered."
    } else {
      errorMessage.value = msg
    }
  } finally {
    isLoading.value = false
  }
})
</script>
