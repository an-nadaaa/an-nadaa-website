<script setup lang="ts">
import { MoreHorizontal } from "lucide-vue-next"
import { cn } from "~/lib/utils"
</script>

<template>
  <li>
    <span
      :class="cn('flex h-10 w-10 items-center justify-center', $attrs.class)"
      role="presentation"
      aria-hidden="true"
    >
      <MoreHorizontal class="h-4 w-4" />
      <span class="sr-only">More pages</span>
    </span>
  </li>
</template>

