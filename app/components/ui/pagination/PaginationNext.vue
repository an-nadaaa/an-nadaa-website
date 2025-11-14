<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { ArrowRight } from "lucide-vue-next"
import { cn } from "~/lib/utils"

const props = defineProps<{
  disabled?: boolean
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <li>
    <div
      :class="
        cn(
          'flex items-center gap-1.5 text-sm font-medium hover:underline',
          props.disabled && 'opacity-50 pointer-events-none',
          props.class
        )
      "
      @click="$emit('click')"
    >
      <span>Next</span>
      <ArrowRight class="w-4 h-4" />
    </div>
  </li>
</template>
