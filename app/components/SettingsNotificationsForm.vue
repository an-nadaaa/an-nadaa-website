<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-medium">Notification settings</h2>
      <p class="text-sm text-muted-foreground">
        We may still send you important notifications about your account
        outside of your notification settings below.
      </p>
    </div>
    <form
      :validation-schema="notificationsSchema"
      :initial-values="notificationsInitial"
      @submit="onNotificationsSubmit"
      class="space-y-6"
    >
      <div
        class="flex flex-col gap-4 opacity-50 pointer-events-none sm:flex-row sm:items-center sm:justify-between"
        aria-disabled="true"
      >
        <div class="space-y-0.5">
          <p class="inline-flex gap-2 items-center text-base font-normal">
            Project Updates
            <span class="px-2 py-0.5 text-xs font-medium rounded-md text-muted-foreground bg-muted">
              Coming soon
            </span>
          </p>
          <p class="text-sm text-muted-foreground">
            These are notifications for updates on the progress of the
            projects you support.
          </p>
        </div>
        <FormField v-slot="{ value, handleChange }" name="isProjectUpdatesNotificationsEnabled">
          <FormItem class="flex gap-2 items-center space-y-0">
            <FormControl>
              <Switch :model-value="value" @update:model-value="handleChange" disabled />
            </FormControl>
            <FormLabel class="mt-0!">Email</FormLabel>
          </FormItem>
        </FormField>
      </div>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <p class="text-base font-normal">Donations</p>
          <p class="text-sm text-muted-foreground">
            These are notifications that are related to your donations. Such as when your donation funds are processed, when your donation is cancelled, when your donation is paused, when your donation is resumed, etc.
          </p>
        </div>

        <FormField v-slot="{ value, handleChange }" name="isDonationNotificationsEnabled">
          <FormItem class="flex gap-2 items-center space-y-0">
            <FormControl>
              <Switch
                :disabled="isSettingsLoading"
                :model-value="value"
                @update:model-value="handleChange"
              />
            </FormControl>
            <FormLabel class="mt-0! cursor-pointer">Email</FormLabel>
          </FormItem>
        </FormField>
      </div>
      <div class="flex gap-2 mt-12">
        <Button type="button" variant="outline" :disabled="!hasChanges" @click="handleResetForm">
          Cancel
        </Button>
        <Button type="submit" :disabled="!hasChanges" :is-loading="isNotificationsLoading">Save</Button>
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
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/toast"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"

const { toast } = useToast()

type NotificationsSettings = {
  isProjectUpdatesNotificationsEnabled: boolean
  isDonationNotificationsEnabled: boolean
}

const settings = ref<NotificationsSettings | null>(null)
const isSettingsLoading = ref(true)

const notificationsInitial = ref <NotificationsSettings | null>(null)
const notificationsSchema = toTypedSchema(
  z.object({
    isProjectUpdatesNotificationsEnabled: z.boolean().default(true),
    isDonationNotificationsEnabled: z.boolean().default(true),
  })
)
const notificationsForm = useForm({
  validationSchema: notificationsSchema,
  // initialValues: notificationsInitial.value,
})
const isNotificationsLoading = ref(false)

onMounted(() => {
  isSettingsLoading.value = true
  $fetch("/api/dashboard/profile", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((res: any) => res.settings?.notifications ?? null).then((res: NotificationsSettings | null) => {
    if(!res) {
      settings.value = {  
        isProjectUpdatesNotificationsEnabled: true,
        isDonationNotificationsEnabled: true,
      }
    } else {
      settings.value = {
        isProjectUpdatesNotificationsEnabled: res?.isProjectUpdatesNotificationsEnabled,
        isDonationNotificationsEnabled: res?.isDonationNotificationsEnabled,
      }
    }
    isSettingsLoading.value = false
  })
  
})


watch(settings, (newVal) => {
  if(!newVal || Object.keys(newVal).length === 0) return
  notificationsForm.setValues({
    isProjectUpdatesNotificationsEnabled: newVal.isProjectUpdatesNotificationsEnabled,
    isDonationNotificationsEnabled: newVal.isDonationNotificationsEnabled,
  })
  notificationsInitial.value = newVal
})

const hasChanges = computed(() => {
  if(!notificationsInitial.value || !notificationsForm.values || isSettingsLoading.value) return false
  return JSON.stringify(notificationsInitial.value) !== JSON.stringify(notificationsForm.values)
})

const handleResetForm = () => {
  notificationsForm.setValues(notificationsInitial.value as NotificationsSettings)
}

const onNotificationsSubmit = notificationsForm.handleSubmit(async (values) => {
  isNotificationsLoading.value = true
  const res = await $fetch("/api/dashboard/notifications", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: values,
  })
  if(res.success) {
    notificationsInitial.value = values as NotificationsSettings
    toast({
      title: "Changes updated successfully",
      variant: "success",
    })
  } else {
    toast({
      title: "Error updating changes",
      description: res.message,
      variant: "warning",
    })
  }
  isNotificationsLoading.value = false
})
</script>
