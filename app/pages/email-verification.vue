<template>
  <div class="flex items-center w-screen h-screen">
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
      <Button @click="openEmailProvider" class="w-full mt-8">Open email</Button>
      <NuxtLink to="/login">
        <div class="relative pt-4 mx-auto w-fit">
          <Icon
            class="absolute text-gray-500 left-0 bottom-px"
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

const route = useRoute()
const { email } = route.query as { email: string }

if (!email) {
  throw createError({
    statusCode: 500,
    fatal: true,
  })
}

const openEmailProvider = () => {
  if (!email) return

  const domain = email.split("@")[1].toLowerCase()

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
</script>
