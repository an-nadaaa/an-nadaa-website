<template>
  <Card class="w-full mx-auto">
    <CardHeader>
      <CardTitle class="font-medium">Payment Details</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit="handleSubmit">
        <div class="grid gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem>
                  <FormLabel
                    >First Name<span class="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="First name"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="space-y-2">
              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem>
                  <FormLabel
                    >Last Name<span class="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      v-bind="componentField"
                      placeholder="Last name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </div>
          <div class="space-y-2">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email<span class="text-red-500">*</span> </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    v-bind="componentField"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="space-y-2">
            <FormField v-slot="{ componentField }" name="phoneNumber">
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="space-y-2">
            <FormField v-slot="{ componentField }" name="cardNumber">
              <FormItem>
                <FormLabel
                  >Card PIN<span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <CardInput v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <FormField v-slot="{ componentField }" name="expiryDate">
                <FormItem>
                  <FormLabel
                    >Expiry Date<span class="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      v-bind="componentField"
                      placeholder="MM/YY"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="space-y-2">
              <FormField v-slot="{ componentField }" name="cvc">
                <FormItem>
                  <FormLabel>CVC<span class="text-red-500">*</span> </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      v-bind="componentField"
                      placeholder="***"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </div>
          <Button type="submit" class="w-full">Donate</Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import parsePhoneNumber from "libphonenumber-js"
import * as z from "zod"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import CardInput from "./CardInput.vue"

const props = defineProps({
  submitHandler: {
    type: Function,
    required: true,
  },
})

const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, {
      message: "First name must be at least 1 characters long",
    }),
    lastName: z.string().min(1, {
      message: "Last name must be at least 1 characters long",
    }),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .refine(
        (value) => {
          return parsePhoneNumber(value)?.isValid() ?? false
        },
        {
          message: "Please enter a valid phone number",
        }
      )
      .optional(),
    cardNumber: z.string().length(16, {
      message: "Invalid card number",
    }),
    expiryDate: z.string().length(5, {
      message: "Please ensure it is in the format MM/YY",
    }),
    cvc: z.string().length(3, {
      message: "CVC must be 3 characters long",
    }),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

// const handleSubmit = form.handleSubmit(async (values: Record<string, any>) => {
//   // props.submitHandler(values)
//   console.log("Form submitted", values)
// })
const handleSubmit = form.handleSubmit((values) => {
  console.log("Form submitted", values)
})

// const handleSubmit = (e: Event) => {
//   e.preventDefault()
//   // console.log("Form submitted")
//   console.log(e.target)
// }
</script>
