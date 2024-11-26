<template>
  <p :class="`text-xs py-1 px-2 w-fit rounded-full ${variant}`">
    {{ text }}
  </p>
</template>

<script setup lang="ts">
type Colors = "purple" | "green" | "red"

defineProps({
  text: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: "green",
  },
})
</script>

<style scoped>
.purple {
  @apply bg-purple-100 text-purple-700;
}

.green {
  @apply bg-green-100 text-green-600;
}

.red {
  @apply bg-red-100 text-red-600;
}
</style>
