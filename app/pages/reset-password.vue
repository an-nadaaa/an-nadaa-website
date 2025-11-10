<template>

    <div class="flex items-center w-screen h-screen">
      <div class="container max-w-lg">
        <img
          class="mx-auto w-14"
          src="assets/media/img/icons/key.svg"
        ></img>
        <h2 class="mt-6 text-2xl font-medium text-center sm:text-3xl">
          Change your password
        </h2>
        <p class="mt-3 text-center text-gray-500">
          Worry not! A few more clicks to get you back into your account.
        </p>
  
        <form class="pb-28 mt-6 space-y-4 w-full" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormControl>
                <Input
                  class=""
                  type="password"
                  placeholder="Enter your new password"

                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="passwordConfirmation">
            <FormItem>
              <FormControl>
                <Input
                  class=""
                  type="password"
                  placeholder="Confirm your new password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

  
          <div class="space-y-3">
            <Button type="submit" class="w-full"> Change password </Button>
          </div>
  
          <NuxtLink to="/login">
            <div class="relative pt-4 mx-auto w-fit">
              <Icon
                class="absolute left-0 bottom-px text-gray-500"
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
  useAppConfig()
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
import { useToast } from "@/components/ui/toast"

const route = useRoute()
const router = useRouter()
const { code } = route.query

if(!code) router.replace('/login')
const { toast } = useToast()
const formSchema = toTypedSchema(
  z.object({
    password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Password must contain at least one letter and one number"),
    passwordConfirmation: z.string().min(8)
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"], // Error will be attached to the passwordConfirmation field
  })
)
const { handleSubmit } = useForm({
  validationSchema: formSchema,
})


const { resetPassword } = useStrapiAuth()

const onSubmit = handleSubmit(async (values) => {
  try{
    await resetPassword({ code: code as string, password: values.password, passwordConfirmation: values.passwordConfirmation })

    toast({
      title: "Password reset",
      description: "Your password has been reset successfully",
    })

    router.replace('/login')
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
