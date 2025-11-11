<template>
  <div class="flex items-center w-screen">
    <div class="container max-w-lg">
      <NuxtLink :to="$localePath('/')">
        <NuxtImg
          class="mx-auto w-10"
          :src="appConfig.logo.symbol_color"
        ></NuxtImg>
      </NuxtLink>
      <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
        Log in to your account
      </h2>
      <p class="mt-3 text-center text-gray-500">
        Welcome back! Please enter your details
      </p>

      <form class="pb-28 mt-6 space-y-4 w-full" @submit="onSubmit">
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

        <div class="flex justify-between items-center">
          <div class="flex relative items-center">
            <FormField
              v-slot="{ value, handleChange }"
              class="space-y-0"
              type="checkbox"
              name="rememberMe"
            >
              <FormItem class="relative">
                <FormControl class="absolute top-1/2 -translate-y-1/2">
                  <Checkbox
                    class="border-gray-300"
                    :checked="value"
                    @update:checked="handleChange"
                  />
                </FormControl>
                <FormLabel class="ml-6 w-max text-sm font-medium text-dark-blue"
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
          <Button
            type="submit"
            class="w-full"
            :isLoading="isLoading"
            :disabled="isLoading"
          >
            Sign in
          </Button>
          <!-- <Button class="gap-2 w-full" variant="white">
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
  layout: "login",
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
import { useToast } from "@/components/ui/toast"
import * as z from "zod"

const { loggedIn, fetch: refreshSession } = useUserSession()
if (loggedIn.value) {
  navigateTo("/dashboard")
}
const { toast } = useToast()
const isLoading = ref(false)
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
  try {
    isLoading.value = true

    await $fetch("/api/login", {
      method: "POST",
      body: {
        email: values.email,
        password: values.password,
      },
    }).then(async (res) => {
      await refreshSession()
      navigateTo("/dashboard")
    })
  } catch (e: any) {
    toast({
      title: "Error logging in",
      description:
        e?.status === 401
          ? "Wrong email or password"
          : e?.message || "An unknown error occurred",
      variant: "destructive",
    })
    isLoading.value = false
  }
})
</script>
