<template>
  <div class="my-4 relative">
    <flicking
      class="hidden sm:block py-16"
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
      <div class="sm:hidden grid grid-cols-1 gap-y-4">
        <TestimonialCard
          class=""
          v-for="(testimonial, index) in testimonials.slice(0, 4)"
          :key="index"
          :testimonial="testimonial"
        ></TestimonialCard>
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

const props = defineProps(["testimonials"])

const plugins = [new Pagination({ type: "bullet" })]

const testimonials = ref<
  { testimonial: string; name: string; link?: string }[]
>(props.testimonials)

testimonials.value = [
  {
    testimonial:
      "Me & My family pray for Allāh to allow us to see that day (Ramadan food package distribution), because we benefit tremendously. The food even lasts beyond eid.",
    name: "Beneficiary",
  },
  {
    testimonial:
      "I have been following , supporting in whatever way I can to the foundation and ma Shaa Allah. I have been following , supporting in whatever way I can to the foundation and ma Shaa Allah.",
    name: "CEO- Bridging Gaps Foundation / Donor from Canada",
    link: "https://youtube.com",
  },
  {
    testimonial:
      "I have been a donor for 5 years and I am proud to be part of this community",
    name: "John Doe",
  },
  {
    testimonial:
      "I have been a donor for 5 years and I am proud to be part of this community",
    name: "John Doe",
  },
  {
    testimonial:
      "I have been a donor for 5 years and I am proud to be part of this community",
    name: "John Doe",
  },
  {
    testimonial:
      "I have been a donor for 5 years and I am proud to be part of this community",
    name: "John Doe",
  },
]
</script>

<style></style>
