<template>
  <div class="flex items-center w-screen h-screen">
    <div class="container max-w-lg">
      <img
        class="mx-auto w-14"
        src="assets/media/img/icons/key.svg"
      ></img>
      <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
        Forgot password?
      </h2>
      <p class="mt-3 text-center text-gray-500">
        No worries, we'll send you reset instructions.
      </p>

      <form class="w-full mt-6 space-y-4 pb-28" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel class="text-slate-600">Email</FormLabel>
            <FormControl>
              <Input
                class=""
                type="text"
                placeholder="Enter your email"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="space-y-3">
          <NuxtLink to="/email-verification">
            <Button type="submit" class="w-full"> Reset password </Button>
          </NuxtLink>
        </div>

        <NuxtLink to="/login">
          <div class="relative pt-4 mx-auto w-fit">
            <Icon
              class="absolute text-gray-500 left-0 bottom-[1px]"
              name="lucide:arrow-left"
            />
            <p class="pl-6 text-sm text-center text-gray-500">Back to log in</p>
          </div>
        </NuxtLink>
      </form>
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
