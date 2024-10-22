<template>
  <div class="relative my-4">
    <flicking
      class="hidden py-16 sm:block"
      :options="{ circular: true, align: { camera: '2%', panel: '0%' } }"
      :plugins="plugins"
    >
      <TestimonialCard
        v-for="(testimonial, index) in testimonials"
        :key="index"
        :testimonial="testimonial"
      ></TestimonialCard>
      <template #viewport>
        <div class="flicking-pagination"></div>
      </template>
    </flicking>
    <div class="container">
      <div class="grid grid-cols-1 sm:hidden gap-y-4">
        <TestimonialCard
          class=""
          v-for="(testimonial, index) in testimonials.slice(0, 4)"
          :key="index"
          :testimonial="testimonial"
        ></TestimonialCard>
        <div class="px-0">
          <Button :variant="'white'" class="w-full py-4">View all</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Flicking from "@egjs/vue3-flicking"
import "@egjs/vue3-flicking/dist/flicking.css"
import "@egjs/flicking-plugins/dist/flicking-plugins.css"
import { Pagination } from "@egjs/flicking-plugins"
import TestimonialCard from "./TestimonialCard.vue"

type Testimonial = {
  testimonial: string
  name: string
  link?: string
}

defineProps({
  testimonials: {
    type: Array<Testimonial>,
    required: true,
  },
})

const plugins = [new Pagination({ type: "bullet" })]

// const testimonials = ref<
//   { testimonial: string; name: string; link?: string }[]
// >(props.testimonials)

// testimonials.value = [
//   {
//     testimonial:
//       "Me & My family pray for Allāh to allow us to see that day (Ramadan food package distribution), because we benefit tremendously. The food even lasts beyond eid.",
//     name: "Beneficiary",
//   },
//   {
//     testimonial:
//       "I have been following , supporting in whatever way I can to the foundation and ma Shaa Allah. I have been following , supporting in whatever way I can to the foundation and ma Shaa Allah.",
//     name: "CEO- Bridging Gaps Foundation / Donor from Canada",
//     link: "https://youtube.com",
//   },
//   {
//     testimonial:
//       "I have been a donor for 5 years and I am proud to be part of this community",
//     name: "John Doe",
//   },
//   {
//     testimonial:
//       "I have been a donor for 5 years and I am proud to be part of this community",
//     name: "John Doe",
//   },
//   {
//     testimonial:
//       "I have been a donor for 5 years and I am proud to be part of this community",
//     name: "John Doe",
//   },
//   {
//     testimonial:
//       "I have been a donor for 5 years and I am proud to be part of this community",
//     name: "John Doe",
//   },
// ]
</script>

<style></style>
