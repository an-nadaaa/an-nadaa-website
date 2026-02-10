<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from "."
import { Primitive } from "reka-ui"
import { cn } from "~/lib/utils"
import { buttonVariants } from "."
import { VueSpinner } from "vue3-spinners"

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
    data-slot="button"
    :disabled="isLoading"
    :as="as"
    :as-child="asChild"
    :class="
      cn(buttonVariants({ variant, size }), props.class, {
        'hover:cursor-pointer': !isLoading,
      })
    "
  >
    <template v-if="isLoading">
      <VueSpinner class="text-white" />
    </template>
    <template v-else>
      <slot />
    </template>
  </Primitive>
</template>
