<template>
  <Toaster />
  <template v-if="!emailSent">
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
            <Button type="submit" class="w-full"> Reset password </Button>
          </div>
  
          <NuxtLink to="/login">
            <div class="relative pt-4 mx-auto w-fit">
              <Icon
                class="absolute text-gray-500 left-0 bottom-px"
                name="lucide:arrow-left"
              />
              <p class="pl-6 text-sm text-center text-gray-500">Back to log in</p>
            </div>
          </NuxtLink>
        </form>
      </div>
    </div>
  </template>
  <template v-else>
      <div class="flex items-center w-screen h-screen">
    <div class="container max-w-xl">
      <img class="mx-auto w-14" src="assets/media/img/icons/email.svg" />
      <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
        Check your email
      </h2>
      <p class="mt-3 text-center text-gray-500">
        We sent a reset link to
        <strong>
          {{ email }}</strong
        >
        <br />
      </p>
      <p class="mt-2 font-light text-center opacity-50">
        Please check your email and click on the reset your password
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
</template>
<script setup lang="ts">
const appConfig = useAppConfig()
definePageMeta({
  layout: "login",
})

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod" 
import { Toaster } from "@/components/ui/toast"
import { useToast } from "@/components/ui/toast"

const emailSent = ref(false)
const email = ref("")
const { toast } = useToast()
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


const { forgotPassword } = useStrapiAuth()

const openEmailProvider = () => {
  if (!email.value) return

  const domain = email.value.split("@")[1].toLowerCase()

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

const onSubmit = handleSubmit(async (values) => {
  try{
    console.log(values.email)
    await forgotPassword({ email: values.email })
    
    email.value = values.email
    emailSent.value = true
  }catch(e:any){
    console.log(e)

    toast({
      title: "Error resetting password",
      description: e.error.message,
      variant: "destructive",
    })
  }
})
</script>
