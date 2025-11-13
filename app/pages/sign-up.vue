<template>
  <div class="flex items-center w-screen">
    <div class="container max-w-lg">
      <NuxtImg
        class="mx-auto w-10"
        :src="appConfig.logo.symbol_color"
      ></NuxtImg>
      <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
        Create an account
      </h2>
      <p class="mt-3 text-center text-gray-500">
        Enter your details to create an account
      </p>

      <form class="pb-28 mt-6 space-y-4 w-full" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel class="text-slate-600">Username*</FormLabel>
            <FormControl>
              <Input
                class=""
                type="text"
                placeholder="Enter your username"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel class="text-slate-600">Email*</FormLabel>
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
            <FormLabel class="text-slate-600">Password*</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Enter your password"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
            <FormDescription> Must be at least 8 characters </FormDescription>
          </FormItem>
        </FormField>

        <div class="space-y-3">
          <Button type="submit" class="w-full" :disabled="isLoading">
            <template v-if="!isLoading"> Create account </template>
            <template v-else> <VueSpinnerBars /> </template>
          </Button>
          <!-- <Button class="gap-2 w-full" variant="white">
            <Icon name="logos:google-icon"></Icon> Sign up with Google
          </Button> -->
        </div>

        <p class="pt-3 text-sm text-center text-gray-400">
          Already have an account?
          <NuxtLink to="/login" class="text-sm text-dark-blue">Log in</NuxtLink>
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
import * as z from "zod"
import { Toaster } from "@/components/ui/toast"
import { useToast } from "@/components/ui/toast"
import { VueSpinnerBars } from "vue3-spinners"

const isLoading = ref(false)
const { toast } = useToast()
const { register } = useStrapiAuth()
const router = useRouter()
const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z
      .string()
      .email({ message: "Invalid email" })
      .min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  })
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    await register({
      username: values.username.toLocaleLowerCase(),
      email: values.email.toLocaleLowerCase(),
      password: values.password,
    })

    router.push({ path: "/check-email", query: { email: values.email } })
  } catch (e: any) {
    console.log(e)

    toast({
      title: "Error creating account",
      description: e.error.message,
      variant: "destructive",
    })
    isLoading.value = false
  }
})
</script>
