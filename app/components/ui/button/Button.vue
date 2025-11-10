<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { Primitive, type PrimitiveProps } from "radix-vue"
import { type ButtonVariants, buttonVariants } from "."
import { cn } from "~/lib/utils"
import { VueSpinnerBars } from "vue3-spinners"

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <template v-if="isLoading !== true">
      <slot />
    </template>
    <template v-else>
      <VueSpinnerBars />
    </template>
  </Primitive>
</template>
