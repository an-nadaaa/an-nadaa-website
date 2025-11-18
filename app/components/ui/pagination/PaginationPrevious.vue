<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { ArrowLeft } from "lucide-vue-next"
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
      <ArrowLeft class="w-4 h-4" />
      <span>Previous</span>
    </div>
  </li>
</template>
