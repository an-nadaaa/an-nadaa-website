<template>
  <div class="w-full bg-light-blue">
    <div class="container grid grid-cols-1 gap-4 py-8 sm:grid-cols-2">
      <div class="p-8 bg-dark-blue rounded-2xl">
        <h1 class="text-4xl font-normal text-white xl:text-6xl">
          Donate for the
        </h1>
        <h1 class="text-4xl font-normal text-white xl:text-6xl">
          sake of Allah
        </h1>

        <p class="mt-2 text-xs font-light text-white">
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
                class="object-cover w-full h-full rounded-2xl"
              />
            </div>
            <template #viewport>
              <div class="flicking-pagination"></div>
            </template>
          </Flicking>
        </AspectRatio>
      </div>
    </div>
    <div class="px-6 text-white bg-dark-blue sm:px-0">
      <div
        class="container grid grid-cols-1 py-8 space-y-8 sm:space-y-0 sm:grid-cols-2 lg:gap-x-8 lg:grid-cols-4"
      >
        <div class="flex flex-col col-span-1 space-y-8">
          <img class="text-xs font-thin w-36" :src="logo" />
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
          class="grid grid-cols-1 col-span-1 space-y-8 lg:space-y-0 lg:col-span-3 lg:grid-cols-3"
        >
          <div v-for="(group, index) in groups" class="flex flex-col space-y-3">
            <p class="text-gray-300">{{ group.type }}</p>
            <NuxtLink
              v-for="(link, index) in group.links"
              :key="index"
              :to="localePath(link.path)"
              class="hover:text-gray-300"
            >
              {{ link.title }}
            </NuxtLink>
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
import { Pagination, AutoPlay } from "@egjs/flicking-plugins"
import img1 from "~/assets/media/img/1.png"
import img2 from "~/assets/media/img/2.png"
import img3 from "~/assets/media/img/3.png"
import img4 from "~/assets/media/img/4.png"

const appConfig = useAppConfig()
const logo = appConfig.logo.white
const localePath = useLocalePath()
const plugins = [
  new Pagination({ type: "bullet" }),
  new AutoPlay({ duration: 1000 }),
]
const images = [img1, img2, img3, img4]
const groups = [
  {
    type: "Causes",
    links: [
      { title: "Build a Mosque", path: "/build-a-mosque" },
      { title: "Build a well", path: "/build-a-well" },
      { title: "Help the widows", path: "/help-widows" },
      { title: "Help the orphans", path: "/help-orphans" },
    ],
  },
  {
    type: "Organisation",
    links: [
      { title: "About us", path: "/about" },
      { title: "Contact", path: "/contact-us" },
      { title: "Terms and Privacy", path: "/privacy" },
    ],
  },
  {
    type: "Quick links",
    links: [
      { title: "Causes", path: "/causes" },
      { title: "Donate", path: "/donate" },
      { title: "FAQs", path: "/faq" },
      { title: "Blogs", path: "/blogs" },
    ],
  },
]
</script>
<style>
.flicking-pagination-bullet {
  @apply bg-gray-300 hover:bg-blue-400;
}

.flicking-pagination-bullet-active {
  @apply bg-blue-400;
}
</style>
