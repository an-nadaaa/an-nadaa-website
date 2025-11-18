<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { BadgeVariants } from "."
import { cn } from "~/lib/utils"
import { badgeVariants } from "."

const props = defineProps<{
  variant?: BadgeVariants["variant"]
  class?: HTMLAttributes["class"]
  showCircle?: boolean
}>()

// Extract text color from variant
const circleColor = computed(() => {
  const variant = props.variant || "default"

  // Map variants to their text color classes
  const colorMap: Record<string, string> = {
    default: "text-primary-foreground",
    secondary: "text-secondary-foreground",
    destructive: "text-destructive-foreground",
    outline: "text-foreground",
    "payment-success": "text-green-600",
    "payment-failed": "text-red-600",
    "payment-pending": "text-yellow-600",
    "payment-refunded": "text-gray-600",
    "campaign-funded": "text-green-600",
    "campaign-ongoing": "text-yellow-600",
    "campaign-completed": "text-gray-600",
    "campaign-cancelled": "text-red-600",
    "campaign-on-hold": "text-gray-600",
    "campaign-paused": "text-gray-600",
    "campaign-terminated": "text-gray-600",
  }

  return colorMap[variant] || "text-foreground"
})
</script>

<template>
  <div :class="cn(badgeVariants({ variant }), props.class)">
    <span
      v-if="showCircle"
      :class="cn('w-1.5 h-1.5 rounded-full', circleColor)"
      style="background-color: currentColor"
    />
    <slot />
  </div>
</template>
