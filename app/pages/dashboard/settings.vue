<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-medium sm:text-3xl">Settings</h1>

    <Tabs v-model="activeTab" default-value="profile" class="w-full">
      <TabsList class="inline-flex w-auto">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <div class="my-8 w-full border border-b border-gray-200">
      </div>
      
      <div class="max-w-4xl">
        <TabsContent value="profile" class="mt-6">
          <div class="space-y-6">
            <div>
              <h2 class="text-lg font-medium">Profile</h2>
              <p class="text-sm text-muted-foreground">
                Update your account details here.
              </p>
            </div>
            <form
              :validation-schema="profileSchema"
              :initial-values="profileInitial"
              @submit="onProfileSubmit"
              class="space-y-8"
            >
              <div class="grid gap-4 items-center sm:grid-cols-3">
                <p class="text-sm text-muted-foreground">Username</p>
                <FormField v-slot="{ componentField }" name="username">
                  <FormItem class="sm:col-span-1">
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid gap-4 items-center sm:grid-cols-3">
                <p class="text-sm text-muted-foreground">Email Address</p>
                <FormField v-slot="{ componentField }" name="email">
                  <FormItem class="sm:col-span-1">
                    <FormControl>
                      <Skeleton v-if="isPendingEmailLoading" class="w-full h-9" />
                      <Input
                        v-else
                        type="email"
                        placeholder="Enter your email"
                        :disabled="!!pendingEmailData?.pendingEmail && !isPendingEmailExpired"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div v-if="pendingEmailData?.pendingEmail && !isPendingEmailExpired" class="grid sm:grid-cols-3">
                <div class="flex sm:col-span-2">
                  <Icon name="lucide:mail" class="mr-4 w-4 h-4 text-4xl text-gray-500 rounded-full" />
                  <p class="text-sm text-muted-foreground">A verification email has been sent to <span class="text-sm font-bold">{{ pendingEmailData.pendingEmail }}</span>. Please check your email for a verification link to change your email address. It expires in <span class="text-sm font-bold">{{ pendingEmailExpiry }}</span>.</p>
                </div>
              </div>
              <div class="flex gap-2 mt-12">
                <Button type="button" variant="outline" :disabled="!hasProfileChanges" @click="profileForm.resetForm">
                  Cancel
                </Button>
                <Button type="submit" :disabled="!hasProfileChanges">Save</Button>
              </div>
            </form>
          </div>
        </TabsContent>
  
        <TabsContent value="password" class="mt-6">
          <div class="space-y-6">
            <div>
              <h2 class="text-lg font-medium">Password</h2>
              <p class="text-sm text-muted-foreground">
                Please enter your current password to change your password.
              </p>
            </div>
            <Form
              :validation-schema="passwordSchema"
              :initial-values="passwordInitial"
              @submit="onPasswordSubmit"
              v-slot="{ resetForm }"
              class="space-y-8"
            >
              <div class="grid gap-4 items-center sm:grid-cols-3">
                <p class="text-sm text-muted-foreground">Current password</p>
                <FormField v-slot="{ componentField }" name="currentPassword">
                  <FormItem class="sm:col-span-2">
                    <FormControl>
                      <Input type="password" placeholder="••••••••" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid gap-4 items-center sm:grid-cols-3">
                <p class="text-sm text-muted-foreground">New password</p>
                <FormField v-slot="{ componentField }" name="newPassword">
                  <FormItem class="sm:col-span-2">
                    <FormControl>
                      <Input type="password" placeholder="••••••••" v-bind="componentField" />
                    </FormControl>
                    <p class="mt-1.5 text-xs text-muted-foreground">
                      Your new password must be more than 8 characters.
                    </p>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid gap-4 items-center sm:grid-cols-3">
                <p class="text-sm text-muted-foreground">Confirm new password</p>
                <FormField v-slot="{ componentField }" name="confirmPassword">
                  <FormItem class="sm:col-span-2">
                    <FormControl>
                      <Input type="password" placeholder="••••••••" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="flex gap-2 mt-12">
                <Button type="button" variant="outline" @click="resetForm">
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </Form>
          </div>
        </TabsContent>
  
        <TabsContent value="notifications" class="mt-6">
          <div class="space-y-6">
            <div>
              <h2 class="text-lg font-medium">Notification settings</h2>
              <p class="text-sm text-muted-foreground">
                We may still send you important notifications about your account
                outside of your notification settings.
              </p>
            </div>
            <Form
              :validation-schema="notificationsSchema"
              :initial-values="notificationsInitial"
              @submit="onNotificationsSubmit"
              v-slot="{ resetForm }"
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
                <Button type="button" variant="outline" @click="resetForm">
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </Form>
          </div>
        </TabsContent>
      </div>

    </Tabs>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
})

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/toast"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { Mail } from "lucide-vue-next"
import * as z from "zod"

type PendingEmailData = {
  pendingEmail: string
  emailChangeTokenExpiry: number
}

const { toast } = useToast()
const { user, fetch: refreshSession } = useUserSession()

const isFormLoading = ref(false)
const isPendingEmailLoading = ref(true)
const pendingEmailData = ref<PendingEmailData | null>()
const activeTab = ref("profile")
const profileSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, { message: "Username is required" }).optional().or(z.literal("")),
    email: z.string().email({ message: "Invalid email" }).optional().or(z.literal("")),
  })
)
const profileInitial = ref({
  username: user.value?.user?.username,
  email: user.value?.user?.email,
})
const profileForm = useForm({
  validationSchema: profileSchema,
  initialValues: profileInitial.value,
})
const hasProfileChanges = computed(() => {
  return JSON.stringify(profileInitial.value) !== JSON.stringify(profileForm.values)
})

onMounted(async () => {
  const res = await $fetch("/api/dashboard/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",

    },
  }) as { success: boolean, pendingEmail?: string, emailChangeTokenExpiry?: number, message: string }
  if(res.pendingEmail && res.emailChangeTokenExpiry) {
    pendingEmailData.value = {
      pendingEmail: res.pendingEmail,
      emailChangeTokenExpiry: res.emailChangeTokenExpiry,
    }
  }
  isPendingEmailLoading.value = false
})
const onProfileSubmit = profileForm.handleSubmit(async (values) => {
  isFormLoading.value = true
  $fetch("/api/dashboard/profile", {
    method: "PUT",
    body: { username: values.username, email: values.email },
  })
  .then(async (res) => {
    if(!res.pendingEmail) {
    toast({
        title: "Profile updated successfully",
        variant: "success",
      })
    } else { 
      toast({
        title: "Email change requested",
        description: "Please check your email for a verification link to change your email address",
        variant: "success",
      })
      // pendingEmailData.value = res.pendingEmail ? res.pendingEmail : null
      pendingEmailData.value = {
        pendingEmail: res.pendingEmail,
        emailChangeTokenExpiry: res.emailChangeTokenExpiry as number,
      }
    }
      isFormLoading.value = false

  }).catch((err) => {
    toast({
      title: "Error updating profile",
      description: err.status===400 ? "Invalid credentials" : err.statusText,
      variant: "warning",
    })
    isFormLoading.value = false
  })
})


const pendingEmailExpiryString = ref('')

let pendingEmailExpiryInterval: number | undefined

function updatePendingEmailExpiry() {
  if (!pendingEmailData.value?.emailChangeTokenExpiry) {
    pendingEmailExpiryString.value = ''
    return
  }
  let diff = pendingEmailData.value.emailChangeTokenExpiry - Date.now()
  if (diff <= 0) {
    pendingEmailExpiryString.value = 'expired'
    return
  }
  const seconds = Math.floor(diff / 1000) % 60
  const minutes = Math.floor(diff / (1000 * 60)) % 60
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const parts = []
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`)
  pendingEmailExpiryString.value = parts.join(' ')
}

onMounted(() => {
  updatePendingEmailExpiry()
  pendingEmailExpiryInterval = window.setInterval(updatePendingEmailExpiry, 1000)
})

onUnmounted(() => {
  if (pendingEmailExpiryInterval) clearInterval(pendingEmailExpiryInterval)
})

// Update timer if the expiry date changes
watch(() => pendingEmailData.value?.emailChangeTokenExpiry, () => {
  updatePendingEmailExpiry()
})

const pendingEmailExpiry = computed(() => pendingEmailExpiryString.value)

const isPendingEmailExpired = computed(() => {
  return pendingEmailExpiryString.value === "expired"
})

watch(pendingEmailData, (newVal) => {
  if(newVal && !isPendingEmailExpired.value) {
    profileForm.setFieldValue("email", newVal.pendingEmail)
  }
})
watch(activeTab, async (newVal) => {
  if(newVal === "profile") {
    profileForm.resetForm()
    isPendingEmailLoading.value = true
    const res = await $fetch("/api/dashboard/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",

    },
  }) as { success: boolean, pendingEmail?: string, emailChangeTokenExpiry?: number, message: string }
  if(res.pendingEmail && res.emailChangeTokenExpiry) {
    pendingEmailData.value = {
      pendingEmail: res.pendingEmail,
      emailChangeTokenExpiry: res.emailChangeTokenExpiry,
    }
  }
  isPendingEmailLoading.value = false
  } 
})
watch(isPendingEmailExpired, (newVal) => {
  if(newVal === true) {
    profileForm.setFieldValue("email", profileInitial.value?.email)
  }
})

const passwordSchema = toTypedSchema(
  z
    .object({
      currentPassword: z.string().min(1, { message: "Current password is required" }),
      newPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
      confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
)

const passwordInitial = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

function onPasswordSubmit() {
  // TODO: call settings API
  toast({
    title: "Password changed successfully",
    variant: "success",
  })
}

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

function onNotificationsSubmit() {
  // TODO: call settings API
  toast({
    title: "Changes updated successfully",
    variant: "success",
  })
}
</script>
