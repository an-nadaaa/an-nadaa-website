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
                      @input="onDateInput"
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
                      @input="onCvcInput"
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

const currentDate = new Date()
const currentMonth = currentDate.getMonth() + 1
const currentYear = currentDate.getFullYear() % 100
const inyear = ref()

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
    expiryDate: z
      .string()
      .regex(/^\d{2}\/\d{2}$/, {
        message: "Please ensure it is in the format MM/YY",
      })
      .refine(
        (value) => {
          const [month, year] = value.split("/") as [string, string]
          const expiryYear = parseInt(year, 10)
          const expiryMonth = parseInt(month, 10)
          return (
            expiryYear > currentYear ||
            (expiryYear === currentYear && expiryMonth >= currentMonth)
          )
        },
        {
          message: "Card has expired",
        }
      ),
    cvc: z
      .string()
      .length(3, {
        message: "CVC must be 3 characters long",
      })
      .regex(/^\d+$/, {
        message: "CVC must be a number",
      }),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const handleSubmit = form.handleSubmit((values) => {
  console.log("Form submitted", values)
})

const onDateInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, "")

  if (value.length > 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4)
  }

  input.value = value
}

const onCvcInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, "")
  input.value = value

  if (value.length > 3) {
    input.value = value.slice(0, 3)
  }
}
</script>
