<template>
  <div class="flex items-center w-screen h-screen">
    <div class="container max-w-xl">
      <img class="mx-auto w-14" src="assets/media/img/icons/email.svg" />
      <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
        Check your email
      </h2>
      <p class="mt-3 text-center text-gray-500">
        We sent a verification link to yahaya@example.com
      </p>

      <Button class="w-full mt-8">Enter code manually</Button>

      <NuxtLink to="/login">
        <div class="relative pt-4 mx-auto w-fit">
          <Icon
            class="absolute text-gray-500 left-0 bottom-[1px]"
            name="lucide:arrow-left"
          />
          <p class="pl-6 text-sm text-center text-gray-500">Back to log in</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
const appConfig = useAppConfig()
definePageMeta({
  layout: "dashboard",
})

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { Checkbox } from "@/components/ui/checkbox"
import { h } from "vue"
import * as z from "zod"

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

const onSubmit = handleSubmit((values) => {
  console.log(values)
})
</script>
