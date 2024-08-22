<template>
  <div class="w-full bg-light-blue">
    <div class="container py-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="bg-dark-blue p-8 rounded-2xl">
        <h1 class="text-white text-4xl xl:text-6xl font-normal">
          Donate for the
        </h1>
        <h1 class="text-white text-4xl xl:text-6xl font-normal">
          sake of Allah
        </h1>

        <p class="text-white font-light text-xs mt-2">
          Your donation will go to where it is needed the most.
        </p>
        <Button class="px-8 mt-8">Donate</Button>
      </div>
      <div class="rounded-2xl">
        <AspectRatio :ratio="1.4 / 1">
          <Flicking
            class="w-full h-full overflow-hidden"
            :options="{ circular: true }"
            :plugins="plugins"
          >
            <div
              v-for="(image, index) in images"
              :key="index"
              class="w-full h-full"
            >
              <img
                :src="image"
                class="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <template #viewport>
              <div class="flicking-pagination"></div>
            </template>
          </Flicking>
        </AspectRatio>
      </div>
    </div>
    <div class="bg-dark-blue text-white px-6 sm:px-0">
      <div
        class="container space-y-8 sm:space-y-0 py-8 grid grid-cols-1 sm:grid-cols-2 lg:gap-x-8 lg:grid-cols-4"
      >
        <div class="col-span-1 flex flex-col space-y-8">
          <img class="w-36 text-xs font-thin" :src="logo" />
          <p>
            contact@an-nadaa.com <br />
            +234 806 781 4149 <br />
            +234 703 873 1615 <br />
            No. 57, Imam Road, Tudun Wada, <br />
            Zaria Kaduna State, Nigeria
          </p>
          <p>
            Unit B-17 StreetMall Jalan Gerbang <br />
            Wawasan 1 <br />
            Bangi Gateway Seksyen 15 43650 <br />
            Banda Bangi <br />
            Selangor Darul Ehsan Malaysia <br />
            +60 19 605 3686
          </p>
        </div>
        <div
          class="col-span-1 space-y-8 lg:space-y-0 lg:col-span-3 grid grid-cols-1 lg:grid-cols-3"
        >
          <div class="flex flex-col space-y-3">
            <p class="text-gray-300">Quick links</p>
            <NuxtLink> Causes </NuxtLink>
            <NuxtLink> Learn </NuxtLink>
            <NuxtLink> Donate </NuxtLink>
            <NuxtLink> FAQs </NuxtLink>
          </div>
          <div class="flex flex-col space-y-3">
            <p class="text-gray-300">Causes</p>
            <NuxtLink> Build a Mosque </NuxtLink>
            <NuxtLink> Build a well </NuxtLink>
            <NuxtLink> Help the widows </NuxtLink>
            <NuxtLink> Help the orphans </NuxtLink>
          </div>
          <div class="flex flex-col space-y-3">
            <p class="text-gray-300">Organisation</p>
            <NuxtLink> About us </NuxtLink>
            <NuxtLink> Contact </NuxtLink>
            <NuxtLink> Terms and Privacy </NuxtLink>
          </div>
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
import img1 from "~/assets/media/img/1.png"
import img2 from "~/assets/media/img/2.png"
import img3 from "~/assets/media/img/3.png"
import img4 from "~/assets/media/img/4.png"
import logo from "~/assets/media/img/logos/annadaa-white.svg"

const plugins = [new Pagination({ type: "bullet" })]
const images = [img1, img2, img3, img4]
</script>
<style>
.flicking-pagination-bullet {
  @apply bg-gray-300 hover:bg-blue-400;
}

.flicking-pagination-bullet-active {
  @apply bg-blue-400;
}
</style>
