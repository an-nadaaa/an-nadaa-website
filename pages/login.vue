<template>
  <div class="flex items-center w-screen h-screen">
    <div class="container max-w-lg">
      <NuxtLink to="/">
        <NuxtImg
          class="w-10 mx-auto"
          :src="appConfig.logo.symbol_color"
        ></NuxtImg>
      </NuxtLink>
      <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
        Log in to your account
      </h2>
      <p class="mt-3 text-center text-gray-500">
        Welcome back! Please enter your details
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
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel class="text-slate-600">Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Enter your password"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex items-center justify-between">
          <div class="relative flex items-center">
            <FormField
              v-slot="{ value, handleChange }"
              class="space-y-0"
              type="checkbox"
              name="rememberMe"
            >
              <FormItem class="">
                <FormControl>
                  <Checkbox
                    class="absolute border-gray-300 bottom-[3px]"
                    :checked="value"
                    @update:checked="handleChange"
                  />
                </FormControl>
                <FormLabel class="ml-6 text-sm font-medium w-max text-dark-blue"
                  >Remember me</FormLabel
                >
              </FormItem>
            </FormField>
          </div>
          <NuxtLink
            to="/forgot-password"
            class="relative text-sm font-medium text-[#166487]"
            >Forgot password</NuxtLink
          >
        </div>

        <div class="space-y-3">
          <Button type="submit" class="w-full"> Sign in </Button>
          <!-- <Button class="w-full gap-2" variant="white">
            <Icon name="logos:google-icon"></Icon> Sign in with Google
          </Button> -->
        </div>

        <p class="pt-3 text-sm text-center text-gray-400">
          Don't have an account?
          <NuxtLink to="/sign-up" class="text-sm text-dark-blue"
            >Sign up</NuxtLink
          >
        </p>
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

const router = useRouter()
const { login } = useStrapiAuth()

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .email({ message: "Invalid email" })
      .min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    rememberMe: z.boolean().default(false),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  console.log(values)

  try {
    await login({ identifier: "fazaamal", password: "Testing123" })

    router.push("/authenticated-page")
  } catch (e) {}
})
</script>
