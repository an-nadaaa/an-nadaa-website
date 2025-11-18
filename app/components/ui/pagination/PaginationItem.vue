<script setup lang="ts">
import { cn } from "~/lib/utils"

interface Props {
  value?: number
  isActive?: boolean
}
</script>

<template>
  <li>
    <button
      :class="cn(
        'h-10 w-10 rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
        $attrs.class
      )"
      @click="$emit('click', value)"
    >
      <slot />
    </button>
  </li>
</template>

