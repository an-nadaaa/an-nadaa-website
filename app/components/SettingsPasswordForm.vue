<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-medium">Password</h2>
      <p class="text-sm text-muted-foreground">
        Please enter your current password to change your password.
      </p>
    </div>
    <form
      :validation-schema="passwordSchema"
      :initial-values="passwordInitial"
      @submit="onPasswordSubmit"
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
        <Button type="button" variant="outline" :disabled="isPasswordFormLoading" @click="passwordForm.resetForm">
          Cancel
        </Button>
        <Button type="submit" :is-loading="isPasswordFormLoading">Save</Button>
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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"

const { toast } = useToast()
const isPasswordFormLoading = ref(false)

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

const passwordForm = useForm({
  validationSchema: passwordSchema,
  initialValues: passwordInitial,
})

const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
  isPasswordFormLoading.value = true
  try {
    await $fetch("/api/dashboard/change-password", {
      method: "POST",
      body: {
        currentPassword: values.currentPassword,
        password: values.newPassword,
        passwordConfirmation: values.confirmPassword,
      },
    })
    toast({
      title: "Password changed successfully",
      variant: "success",
    })
    passwordForm.resetForm()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; statusMessage?: string; statusCode?: number }
    toast({
      title: "Error changing password",
      description: e?.data?.message ?? e?.statusMessage ?? "Something went wrong",
      variant: "warning",
    })
  } finally {
    isPasswordFormLoading.value = false
  }
})
</script>
