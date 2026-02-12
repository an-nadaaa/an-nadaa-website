<script lang="ts" setup>
import type { DialogContentEmits, DialogContentProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { useForwardPropsEmits } from "reka-ui"
import { DrawerContent, DrawerPortal } from "vaul-vue"
import { cn } from '~/lib/utils'
import DrawerOverlay from "./DrawerOverlay.vue"

const props = withDefaults(
  defineProps<DialogContentProps & {
    class?: HTMLAttributes["class"]
    direction?: "bottom" | "right"
  }>(),
  { direction: "bottom" }
)
const emits = defineEmits<DialogContentEmits>()

const forwarded = useForwardPropsEmits(props, emits)

const isRight = computed(() => props.direction === "right")
const contentClass = computed(() =>
  isRight.value
    ? "fixed right-0 top-0 bottom-0 z-50 flex h-full w-full max-w-sm flex-col rounded-l-[10px] border-l border bg-background"
    : "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background"
)
</script>

<template>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent
      v-bind="forwarded"
      :class="cn(contentClass, props.class)"
    >
      <div
        v-if="!isRight"
        class="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted"
      />
      <slot />
    </DrawerContent>
  </DrawerPortal>
</template>
