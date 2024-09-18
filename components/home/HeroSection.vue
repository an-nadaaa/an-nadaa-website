<template>
  <div class="py-12 bg-dark-blue">
    <div class="container grid grid-cols-1 text-white md:grid-cols-2 md:gap-12">
      <div class="h-full lg:pt-8">
        <div class="space-y-3 sm:space-y-6">
          <h1 class="text-3xl lg:text-4xl xl:text-6xl">
            Support Nigerian communities through education and welfare projects
          </h1>
          <p class="font-light">
            You can bring change to lives of millions by supporting us to
            deliver projects that bring huge positive impact to the community
          </p>
          <div
            class="grid grid-cols-1 space-y-2 sm:w-fit sm:space-y-0 sm:flex sm:space-x-4"
          >
            <Button class="w-full text-sm font-light">Donate now</Button>
            <Button
              class="w-full text-sm font-light bg-white hover:bg-gray-300 text-foreground"
              >Watch our impact
              <Icon class="ml-2" name="lucide:circle-play" />
            </Button>
          </div>
          <p class="font-thin text-center text-md sm:text-sm sm:text-left">
            100,000+ lives impacted. Help us reach more
          </p>
        </div>
      </div>
      <div class="mt-5 sm:mt-0">
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
  </div>
</template>
<script setup lang="ts">
import Plyr from "plyr"
import "plyr/dist/plyr.css"
import AspectRatio from "../ui/aspect-ratio/AspectRatio.vue"

const plyr = ref<any>(null)

onMounted(() => {
  // plyr.value = new Plyr(document.getElementById("player") as HTMLElement)
})
</script>
<style lang=""></style>
