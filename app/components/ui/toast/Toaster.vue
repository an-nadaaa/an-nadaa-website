<script setup lang="ts">
import { Check, AlertTriangle } from 'lucide-vue-next'
import { isVNode } from 'vue'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '.'
import { useToast } from './use-toast'

const { toasts } = useToast()
</script>

<template>
  <ToastProvider>
    <Toast v-for="toast in toasts" :key="toast.id" v-bind="toast">
      <div class="flex gap-3 items-center">
        <div
          v-if="toast.variant === 'success'"
          class="flex justify-center items-center w-5 h-5 text-black bg-emerald-600 rounded-full shrink-0"
          aria-hidden
        >
          <Check class="w-3 h-3" />
        </div>
        <div
          v-if="toast.variant === 'warning'"
          class="flex justify-center items-center w-5 h-5 text-black bg-amber-600 rounded-full shrink-0"
          aria-hidden
        >
          <AlertTriangle class="w-3 h-3" />
        </div>
        <div class="grid flex-1 gap-1">
          <ToastTitle v-if="toast.title">
            {{ toast.title }}
          </ToastTitle>
          <template v-if="toast.description">
            <ToastDescription v-if="isVNode(toast.description)">
              <component :is="toast.description" />
            </ToastDescription>
            <ToastDescription v-else>
              {{ toast.description }}
            </ToastDescription>
          </template>
        </div>
        <ToastClose />
      </div>
      <component :is="toast.action" />
    </Toast>
    <ToastViewport />
  </ToastProvider>
</template>
