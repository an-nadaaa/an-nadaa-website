<template>
  <div>
    <form class="space-y-2" @submit="onSubmit">
      <div class="grid grid-cols-2 gap-x-4">
        <FormField v-slot="{ componentField }" name="firstName">
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input
                type="text"
                v-bind="componentField"
                placeholder="First Name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="lastName">
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input
                type="text"
                v-bind="componentField"
                placeholder="Last Name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              type="email"
              v-bind="componentField"
              placeholder="Enter your email"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="company">
        <FormItem>
          <FormLabel>Company</FormLabel>
          <FormControl>
            <Input
              type="text"
              v-bind="componentField"
              placeholder="Enter your company/organisation name"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="phoneNumber">
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <PhoneInput v-bind="componentField"></PhoneInput>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="message">
        <FormItem>
          <FormLabel>Message</FormLabel>
          <FormControl>
            <Textarea v-bind="componentField" placeholder="Type your message" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button class="w-full" type="submit">Send</Button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"
import { Textarea } from "@/components/ui/textarea"

const email = "b9a6d9877fa1aca555140617b2ec027b"
const phoneInput = ref(null)

const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, {
      message: "First name must be at least 2 characters long",
    }),
    lastName: z
      .string()
      .min(1, {
        message: "Last name must be at least 2 characters long",
      })
      .optional(),
    email: z.string().email("Please enter a valid email"),
    company: z.string().optional(),
    phoneNumber: z.number().optional(),
    message: z.string().min(1, {
      message: "Message must be at least 1 character long",
    }),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  console.log(values)
})
</script>

<style>
label {
  @apply font-normal text-dark-gray;
}
</style>
