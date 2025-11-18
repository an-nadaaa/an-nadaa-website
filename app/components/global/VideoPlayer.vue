<template>
  <media-player autoplay playsInline :src="src">
    <media-poster
      class="absolute inset-0 block h-full w-full rounded-md bg-black opacity-0 transition-opacity data-visible:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
      :src="thumbnail"
    />
    <ClientOnly>
      <media-provider></media-provider>
    </ClientOnly>
  </media-player>
</template>
<script setup lang="ts">
import "vidstack/bundle"

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: false,
  },
})
</script>
