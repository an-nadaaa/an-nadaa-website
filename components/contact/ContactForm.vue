<template>
  <div>
    <PhoneInput />
  </div>
</template>
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"
import PhoneInput from "base-vue-phone-input"
import { Phone } from "lucide-vue-next"

const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    company: z.string().optional(),
    phoneNumber: z.string().optional(),
    message: z.string().min(1),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log("Form submitted!", values)
})
</script>
