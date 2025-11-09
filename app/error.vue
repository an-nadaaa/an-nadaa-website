<template>
  <NuxtLayout>
    <div
      class="container grid gap-y-12 items-center py-16 pb-8 sm:grid-cols-2 md:gap-x-16 lg:gap-x-32"
    >
      <div>
        <h4 class="text-lg font-normal text-primary">
          {{ error?.statusCode || "404" }} ERROR
        </h4>
        <h1 class="my-2 font-medium">Page not found</h1>
        <p class="font-light text-dark-gray">
          Sorry, the page you are looking for doesn't exist or has been moved.
          Here are some helpful links:
        </p>

        <div class="grid grid-cols-2 gap-2 mt-8 sm:w-fit sm:gap-0">
          <Button
            @click="
              () => {
                try {
                  router.back()
                } catch {
                  router.push('/')
                }
              }
            "
            class="sm:w-fit"
            :variant="'white'"
          >
            <Icon name="lucide:arrow-left" class="mr-2" />
            Go back</Button
          >
          <NuxtLink :to="$localePath('/')">
            <Button class="sm:w-fit" :variant="'default'"> Take me home</Button>
          </NuxtLink>
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
import { Button } from "~/components/ui/button"

const router = useRouter()

const props = defineProps({
  error: Object as () => NuxtError,
})
</script>
