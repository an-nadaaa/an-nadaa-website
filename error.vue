<template>
  <NuxtLayout>
    <div
      class="grid sm:grid-cols-2 py-16 pb-8 container gap-y-12 md:gap-x-16 lg:gap-x-32 items-center"
    >
      <div>
        <h4 class="text-primary text-lg font-normal">
          {{ error?.statusCode }} ERROR
        </h4>
        <h1 class="font-medium my-2">Page not found</h1>
        <p class="text-dark-gray font-light">
          Sorry, the page you are looking for doesn't exist or has been moved.
          Here are some helpful links:
        </p>

        <div class="grid grid-cols-2 sm:w-fit mt-8 gap-2 sm:gap-0">
          <Button class="sm:w-fit" :variant="'white'">
            <Icon name="lucide:arrow-left" class="mr-2" />
            Go back</Button
          >
          <Button class="sm:w-fit" :variant="'default'"> Take me home</Button>
        </div>
      </div>
      <div>
        <AspectRatio class="overflow-hidden rounded-2xl" :ratio="1 / 1.1">
          <video
            id="player"
            playsinline
            controls="false"
            data-poster="assets/media/img/VideoCover.png"
            style="object-fit: cover; width: 100%; height: 100%"
          >
            <source
              src="assets/media/video/What-Is-An-Nadaa.mp4"
              type="video/mp4"
            />
          </video>
        </AspectRatio>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app"

const props = defineProps({
  error: Object as () => NuxtError,
})
</script>
