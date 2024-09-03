<template>
  <div
    class="text-white rounded-lg w-full sm:w-[400px] mr-2 bg-dark-blue overflow-hidden"
  >
    <AspectRatio class="relative flex items-center p-8 pt-12" :ratio="1">
      <div class="w-full absolute top-8">
        <img class="" src="~/assets/media/img/Quote.svg" />
      </div>
      <div class="">
        <p class="text-lg sm:text-xl text-center font-medium">
          {{ testimonial.testimonial }}
        </p>
        <p class="text-center font-light mt-4">
          {{ testimonial.name }}
        </p>
        <NuxtLink :to="testimonial.link" v-if="testimonial.link">
          <p
            class="hidden mt-4 sm:flex justify-center items-center text-primary text-center"
          >
            <Icon class="mr-2" name="lucide:circle-play" />
            Watch on YouTube
          </p>
        </NuxtLink>
      </div>
    </AspectRatio>
  </div>
</template>
<script setup lang="ts">
type Testimonial = {
  testimonial: string
  name: string
  link?: string
}
const props = defineProps({
  testimonial: {
    type: Object as () => Testimonial,
    required: true,
  },
})
</script>
<style></style>
