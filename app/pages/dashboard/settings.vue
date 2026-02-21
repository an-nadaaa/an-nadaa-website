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
                <Button type="button" variant="outline" :disabled="!hasProfileChanges || isProfileFormLoading" @click="profileForm.resetForm({ values: profileInitial })">
                  Cancel
                </Button>
                <Button type="submit" :disabled="!hasProfileChanges" :is-loading="isProfileFormLoading">Save</Button>
              </div>
            </form>
          </div>
        </TabsContent>
  
        <TabsContent value="password" class="mt-6">
          <SettingsPasswordForm />
        </TabsContent>

        <TabsContent value="notifications" class="mt-6">
          <SettingsNotificationsForm />
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
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/toast"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"

type PendingEmailData = {
  pendingEmail: string
  emailChangeTokenExpiry: number
}

const { toast } = useToast()
const { user } = useUserSession()

const isProfileFormLoading = ref(false)
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

async function loadProfileIntoForm() {
  const res = await $fetch("/api/dashboard/profile", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }) as {
    success: boolean
    username?: string | null
    email?: string | null
    pendingEmail?: string | null
    emailChangeTokenExpiry?: number | null
    message: string
  }
  const username = res.username ?? ""
  const email = res.email ?? ""
  profileInitial.value = { username, email }
  profileForm.setValues({ username, email })
  if (res.pendingEmail && res.emailChangeTokenExpiry) {
    pendingEmailData.value = {
      pendingEmail: res.pendingEmail,
      emailChangeTokenExpiry: res.emailChangeTokenExpiry,
    }
  } else {
    pendingEmailData.value = null
  }
  isPendingEmailLoading.value = false
}

onMounted(async () => {
  await loadProfileIntoForm()
})
const onProfileSubmit = profileForm.handleSubmit(async (values) => {
  isProfileFormLoading.value = true
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
      isProfileFormLoading.value = false

  }).catch((err) => {
    toast({
      title: "Error updating profile",
      description: err.status===400 ? "Invalid credentials" : err.statusText,
      variant: "warning",
    })
    isProfileFormLoading.value = false
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
  if (newVal === "profile") {
    isPendingEmailLoading.value = true
    await loadProfileIntoForm()
  }
})
watch(isPendingEmailExpired, (newVal) => {
  if(newVal === true) {
    profileForm.setFieldValue("email", profileInitial.value?.email)
  }
})

</script>
