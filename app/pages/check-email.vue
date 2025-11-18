<template>
  <div class="flex items-center w-screen">
    <div class="container max-w-xl">
      <img class="mx-auto w-14" src="assets/media/img/icons/email.svg" />
      <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
        Check your email
      </h2>
      <p class="mt-3 text-center text-gray-500">
        We sent a verification link to <br />
        <strong> {{ email }}</strong>
        <br />
      </p>
      <p class="mt-2 font-light text-center opacity-50">
        Please check your email and click on the link to verify your email
        address.
      </p>
      <Button @click="openEmailProvider" class="mt-8 w-full">Open email</Button>
      <Button
        variant="outline"
        @click="handleResendEmail"
        :disabled="!isResendEnabled || isResendLoading"
        class="mt-2 w-full outline-2 outline-primary -outline-offset-2 text-primary hover:text-[#2397ba] disabled:opacity-50 disabled:cursor-not-allowed"
        ><template v-if="!isResendLoading"> {{ resendButtonText }} </template>
        <template v-else> <VueSpinnerBars /> </template>
      </Button>
      <NuxtLink to="/login">
        <div class="relative pt-4 mx-auto w-fit">
          <Icon
            class="absolute left-0 bottom-px text-gray-500"
            name="lucide:arrow-left"
          />
          <p class="pl-6 text-sm text-center text-gray-500">Back to log in</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "login",
})

import { Button } from "@/components/ui/button"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"
import { VueSpinnerBars } from "vue3-spinners"

const route = useRoute()
const isResendEnabled = ref(false)
const isResendLoading = ref(false)
const lastResendTime = ref<number | null>(null)
const timeRemaining = ref<number>(0)
const countdownInterval = ref<NodeJS.Timeout | null>(null)
const { sendEmailConfirmation } = useStrapiAuth()
const { email } = route.query as { email: string }

const RESEND_TIMEOUT_MS = 2 * 60 * 1000 // 2 minutes in milliseconds

if (!email) {
  throw createError({
    statusCode: 500,
    fatal: true,
  })
}

const startCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }

  const updateCountdown = () => {
    if (!lastResendTime.value) {
      isResendEnabled.value = true
      timeRemaining.value = 0
      localStorage.removeItem(`resend_timeout_${email}`)
      if (countdownInterval.value) {
        clearInterval(countdownInterval.value)
        countdownInterval.value = null
      }
      return
    }

    const elapsed = Date.now() - lastResendTime.value
    const remaining = RESEND_TIMEOUT_MS - elapsed

    if (remaining <= 0) {
      isResendEnabled.value = true
      timeRemaining.value = 0
      lastResendTime.value = null
      localStorage.removeItem(`resend_timeout_${email}`)
      if (countdownInterval.value) {
        clearInterval(countdownInterval.value)
        countdownInterval.value = null
      }
    } else {
      isResendEnabled.value = false
      timeRemaining.value = Math.ceil(remaining / 1000) // Convert to seconds
    }
  }

  updateCountdown()
  countdownInterval.value = setInterval(updateCountdown, 1000)
}

const handleResendEmail = async () => {
  if (!isResendEnabled.value || isResendLoading.value || !email) return

  isResendLoading.value = true

  try {
    // TODO: Implement actual resend email API call here
    await sendEmailConfirmation({ email })
    // Set the last resend time and start countdown
    const now = Date.now()
    lastResendTime.value = now
    localStorage.setItem(`resend_timeout_${email}`, now.toString())
    startCountdown()
  } catch (error) {
    console.error("Failed to resend email:", error)
    // You might want to show an error message to the user here
  } finally {
    isResendLoading.value = false
  }
}

const resendButtonText = computed(() => {
  if (!isResendEnabled.value && timeRemaining.value > 0) {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `Resend email (${minutes}:${seconds.toString().padStart(2, "0")})`
  }
  return "Resend email"
})

const openEmailProvider = () => {
  if (!email) return

  const emailParts = email.split("@")
  const domain = emailParts[1]?.toLowerCase()
  if (!domain) return

  let emailUrl = ""

  if (domain.includes("gmail.com")) {
    emailUrl = "https://mail.google.com/"
  } else if (domain.includes("outlook.com") || domain.includes("hotmail.com")) {
    emailUrl = "https://outlook.live.com/"
  } else if (domain.includes("yahoo.com")) {
    emailUrl = "https://mail.yahoo.com/"
  } else if (domain.includes("icloud.com")) {
    emailUrl = "https://www.icloud.com/mail"
  } else {
    emailUrl = `https://${domain}`
  }

  window.open(emailUrl, "_blank")
}

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .email({ message: "Invalid email" })
      .min(1, { message: "Email is required" }),
  })
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

onMounted(() => {
  // Check if there's a stored last resend time (optional - for persistence across page refreshes)
  // You can uncomment this if you want to persist the timeout across page refreshes
  const stored = localStorage.getItem(`resend_timeout_${email}`)
  if (stored) {
    const storedTime = parseInt(stored, 10)
    const elapsed = Date.now() - storedTime
    if (elapsed < RESEND_TIMEOUT_MS) {
      lastResendTime.value = storedTime
      startCountdown()
    } else {
      localStorage.removeItem(`resend_timeout_${email}`)
      isResendEnabled.value = true
    }
  } else {
    isResendEnabled.value = true
  }

  // If there's already a lastResendTime, start the countdown
  if (lastResendTime.value) {
    startCountdown()
  }
})

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
})
</script>
