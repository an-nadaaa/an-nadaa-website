<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-medium sm:text-3xl">Settings</h1>

    <Tabs default-value="profile" class="w-full">
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
            <Form
              :validation-schema="profileSchema"
              :initial-values="profileInitial"
              @submit="onProfileSubmit"
              v-slot="{ resetForm }"
              class="space-y-8"
            >
              <div class="grid gap-4 items-center sm:grid-cols-3">
                <p class="text-sm text-muted-foreground">Name</p>
                <FormField v-slot="{ componentField }" name="firstName">
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="First name"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="lastName">
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Last name"
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
                  <FormItem class="sm:col-span-2">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="me@an-nadaa.com"
                        
                        v-bind="componentField"
                      />
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/toast"
import { toTypedSchema } from "@vee-validate/zod"
import { Mail } from "lucide-vue-next"
import * as z from "zod"

const { toast } = useToast()

const profileSchema = toTypedSchema(
  z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email({ message: "Invalid email" }).optional().or(z.literal("")),
  })
)

const profileInitial = {
  firstName: "",
  lastName: "",
  email: "",
}

function onProfileSubmit() {
  // TODO: call settings API
  toast({
    title: "Profile updated successfully",
    variant: "success",
  })
}

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
