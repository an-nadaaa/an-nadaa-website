<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-medium">Notification settings</h2>
      <p class="text-sm text-muted-foreground">
        We may still send you important notifications about your account
        outside of your notification settings.
      </p>
    </div>
    <form
      :validation-schema="notificationsSchema"
      :initial-values="notificationsInitial"
      @submit="onNotificationsSubmit"
      class="space-y-6"
    >
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <p class="text-base font-normal">Project Updates</p>
          <p class="text-sm text-muted-foreground">
            These are notifications for updates on the progress of the
            projects you support.
          </p>
        </div>
        <FormField v-slot="{ value, handleChange }" name="projectUpdatesEmail">
          <FormItem class="flex gap-2 items-center space-y-0">
            <FormControl>
              <Switch
                :checked="value"
                @update:checked="handleChange"
              />
            </FormControl>
            <FormLabel class="mt-0! cursor-pointer">Email</FormLabel>
          </FormItem>
        </FormField>
      </div>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <p class="text-base font-normal">Donation Payment</p>
          <p class="text-sm text-muted-foreground">
            These are notifications for when your donation funds are
            processed.
          </p>
        </div>
        <FormField v-slot="{ value, handleChange }" name="donationPaymentEmail">
          <FormItem class="flex gap-2 items-center space-y-0">
            <FormControl>
              <Switch
                :checked="value"
                @update:checked="handleChange"
              />
            </FormControl>
            <FormLabel class="mt-0! cursor-pointer">Email</FormLabel>
          </FormItem>
        </FormField>
      </div>
      <div class="flex gap-2 mt-12">
        <Button type="button" variant="outline" @click="notificationsForm.resetForm">
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/toast"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"

const { toast } = useToast()

const notificationsSchema = toTypedSchema(
  z.object({
    projectUpdatesEmail: z.boolean(),
    donationPaymentEmail: z.boolean(),
  })
)

const notificationsInitial = {
  projectUpdatesEmail: true,
  donationPaymentEmail: false,
}

const notificationsForm = useForm({
  validationSchema: notificationsSchema,
  initialValues: notificationsInitial,
})

const onNotificationsSubmit = notificationsForm.handleSubmit(async () => {
  // TODO: call settings API
  toast({
    title: "Changes updated successfully",
    variant: "success",
  })
})
</script>
