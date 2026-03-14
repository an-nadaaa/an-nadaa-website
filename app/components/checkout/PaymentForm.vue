<template>
  <Card class="gap-y-3 mx-auto w-full">
    <CardHeader>
      <CardTitle class="font-normal">Payment Details</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit">
        <div
          :class="{ 'opacity-50 pointer-events-none': loading }"
          class="grid gap-4"
        >
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
          <div>
            <h4
              :class="`mb-2 text-sm font-medium ${
                stripeErrorMessage ? 'text-red-500' : 'text-gray-500'
              }`"
            >
              Card Details<span class="text-red-500">*</span>
            </h4>

            <StripeCardInput
              class="col-span-2"
              v-model:error-message="stripeErrorMessage"
              v-model:card="card"
            />
            <p class="mt-2 text-sm font-medium text-red-500">
              {{ stripeErrorMessage }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <template v-if="isZakatEligible">
              <Checkbox id="zakat" v-model:checked="isZakat" />
              <label for="zakat" class="text-sm font-light cursor-pointer text-dark-gray">
                This is a Zakat donation
              </label>
            </template>
            <TooltipProvider v-else>
              <TooltipRoot :delay-duration="0">
                <TooltipTrigger as-child>
                  <span
                    class="flex items-center gap-2 opacity-50 cursor-not-allowed"
                  >
                    <Checkbox id="zakat-disabled" disabled />
                    <label
                      for="zakat-disabled"
                      class="text-sm font-light text-dark-gray cursor-not-allowed"
                    >
                      This is a Zakat donation
                    </label>
                  </span>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent
                    class="px-2 py-1 text-xs text-white bg-gray-900 rounded z-[100] max-w-[240px]"
                    :side-offset="5"
                  >
                    Not Zakat-eligible. This cause is supported through Sadaqah and general donations only.
                  </TooltipContent>
                </TooltipPortal>
              </TooltipRoot>
            </TooltipProvider>
          </div>
        </div>
        <Button
          type="submit"
          :isLoading="loading"
          :disabled="loading"
          class="mt-4 w-full"
        >
          Donate
        </Button>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
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
} from "~/components/ui/form"

import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "reka-ui"
import StripeCardInput from "./StripeCardInput.vue"
import type { StripeCardElement } from "@stripe/stripe-js"
// import { useStripe } from "~/composables/useStripe"
import { useToast } from "@/components/ui/toast"

type DonationDetails = {
  causeSelected: string
  donateAmount: number
  currencySelected: string
  donationFrequency: string
  isZakat?: boolean
  isZakatCompatible?: boolean
}
const { toast } = useToast()
const { user, loggedIn } = useUserSession()

const donationDetails = defineModel<DonationDetails>("donationDetails", {
  type: Object as PropType<DonationDetails>,
  required: true,
})
const loading = defineModel("loading", {
  type: Boolean,
  default: false,
  required: true,
})
const isZakat = ref(false)
const isZakatEligible = computed(
  () => donationDetails.value?.isZakatCompatible === true
)
watch(isZakatEligible, (eligible) => {
  if (!eligible) isZakat.value = false
})
const stripe = await useStripe()
const router = useRouter()
const card = ref<StripeCardElement | null>(null)
const stripeErrorMessage = ref("")
// const isFormValid = computed(() => {
//   if (Object.keys(form.errors).length > 0 || stripeErrorMessage.value) {
//     return false
//   }
//   return true
// })

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
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const handleSubmit = form.handleSubmit(async (values: Record<string, any>) => {
  try {
    loading.value = true

    const { currencySelected, donationFrequency, donateAmount, causeSelected } =
      donationDetails.value

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      // cardNumber,
      // cvc,
      // expiryDate,
    } = values
    const fullName = `${firstName} ${lastName}`

    if (!stripe) {
      throw new Error("Stripe is not initialized")
    }

    if (!card.value) {
      throw new Error("Invalid card details")
    }

    // Create payment method
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: card.value,
      billing_details: {
        name: fullName,
        email: email,
        phone: phoneNumber,

        // name: fullName,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    // Send to serverless function
    const response = await fetch("/api/process-donation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // paymentMethodId: paymentMethod.id,
        // amount: donateAmount.value * 100, // Convert to cents
        // email: email,
        // name: fullName,
        // phone: phoneNumber,
        // currency: currencySelected.value,
        paymentMethodId: paymentMethod.id,
        amount: donateAmount * 100, // 50.00 USD in cents
        email: email,
        name: fullName,
        phone: phoneNumber,
        currency: currencySelected,
        donationType: donationFrequency,
        causeId: causeSelected,
        isZakat: isZakat.value === true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json() // Parse the JSON response
      throw new Error(errorData.message || "Something went wrong")
    }

    const result = await response.json()

    const { clientSecret, paymentIntentId, subscriptionId } = result

    // Handle the payment confirmation based on donation type
    if (donationFrequency === "monthly") {
      // Handle subscription confirmation
      const res = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      })

      if (res.error) {
        throw new Error(res.error.message)
      }

      router.push({
        path: "/checkout/status",
        query: {
          id: subscriptionId,
        },
      })

      return
    } else {
      // Handle one-time payment confirmation
      // Redirect to Stripe Checkout for one-time payment

      const res = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      })

      if (res.error) {
        throw new Error(res.error.message)
      }

      router.push({
        path: "/checkout/status",
        query: {
          id: paymentIntentId,
        },
      })
    }
  } catch (err: any) {
    console.log(err)
    loading.value = false

    toast({
      title: "Error processing payment",
      description: err,
      variant: "destructive",
    })
  }
})

// const onDateInput = (event: Event) => {
//   const input = event.target as HTMLInputElement
//   let value = input.value.replace(/\D/g, "")

//   if (value.length > 2) {
//     value = value.slice(0, 2) + "/" + value.slice(2, 4)
//   }

//   input.value = value
// }

// const onCvcInput = (event: Event) => {
//   const input = event.target as HTMLInputElement
//   let value = input.value.replace(/\D/g, "")
//   input.value = value

//   if (value.length > 3) {
//     input.value = value.slice(0, 3)
//   }
// }
</script>
