<template>
  <div class="py-4 text-white bg-dark-blue">
    <div class="container flex justify-between">
      <NuxtLink :href="localePath('/')">
        <img :src="logo" alt="Annadaa" class="w-32" />
      </NuxtLink>
      <div
        class="items-center hidden sm:space-x-2 md:space-x-4 sm:flex lg:space-x-8"
      >
        <NuxtLink class="hover:text-gray-200" :to="localePath('/')"
          >Home</NuxtLink
        >
        <NuxtLink
          class="hover:text-gray-200 lg:hidden"
          :to="localePath('/causes')"
          >Causes</NuxtLink
        >

        <div class="items-center hidden h-full pr-0 lg:flex lg:pr-2">
          <HoverCard v-model:open="isCauseOpen" :openDelay="100">
            <HoverCardTrigger>
              <NuxtLink :to="'/causes'">
                <div ref="causeDiv" class="flex gap-x-1">
                  <div class="">Causes</div>
                  <div>
                    <Icon
                      :class="`absolute text-xl translate-y-[2px] transition-all ${
                        isCauseOpen ? 'rotate-180' : ''
                      }`"
                      name="lucide:chevron-down"
                    ></Icon>
                  </div>
                </div>
              </NuxtLink>
            </HoverCardTrigger>
            <HoverCardContent class="hidden w-72 lg:block">
              <div class="grid gap-y-4" ref="popover">
                <NuxtLink v-for="(item, index) in causesLinks" :to="item.path">
                  <div
                    class="grid grid-cols-6 p-2 align-middle rounded-sm hover:cursor-pointer hover:bg-gray-100"
                    :key="index"
                  >
                    <Icon
                      :name="item.icon"
                      class="col-span-1 text-2xl text-primary"
                    ></Icon>
                    <h5 class="col-span-5 text-base font-normal text-left">
                      {{ item.title }}
                    </h5>
                    <div class="col-span-1"></div>
                    <p class="col-span-5 text-xs font-light text-dark-gray">
                      {{ item.description }}
                    </p>
                  </div>
                </NuxtLink>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <NuxtLink class="hover:text-gray-200" :to="localePath('/blogs')"
          >Blogs</NuxtLink
        >

        <NuxtLink class="hover:text-gray-200" :to="localePath('/about')"
          >About</NuxtLink
        >

        <NuxtLink class="hover:text-gray-200" :to="localePath('/faq')"
          >FAQs</NuxtLink
        >
        <NuxtLink class="hover:text-gray-200" :to="localePath('/contact')"
          >Contact</NuxtLink
        >
      </div>
      <div class="items-center hidden space-x-8 sm:flex">
        <!-- <NuxtLink
          :to="localePath('/login')"
          class="text-primary hover:text-blue-200"
          >Log in</NuxtLink
        > -->
        <NuxtLink :to="localePath('/donate')">
          <Button ref="donateButton">Donate</Button>
        </NuxtLink>
      </div>

      <div class="flex items-center sm:hidden">
        <Icon class="text-3xl" name="lucide:align-justify" />
      </div>
    </div>
  </div>

  <NuxtLink :to="'/donate'">
    <div
      v-if="!isButtonVisible"
      class="fixed bottom-0 z-50 w-full py-3 sm:hidden bg-primary"
    >
      <p class="text-lg text-center text-white">Donate now</p>
    </div>
  </NuxtLink>
</template>
<script setup lang="ts">
import { useElementVisibility, useElementHover } from "@vueuse/core"

const isCauseOpen = ref(false)
const donateButton = ref(null)
const isButtonVisible = useElementVisibility(donateButton)

const appConfig = useAppConfig()
const logo = appConfig.logo.white
const localePath = useLocalePath()
const causesLinks = [
  {
    title: "Campaigns",
    description: "Opportunities to help those in need",
    icon: "lucide:book",
    path: "/causes?type=campaign",
  },
  {
    title: "Projects",
    description: "A perpetual way to give to those who need it most",
    icon: "lucide:sparkles",
    path: "/causes?type=project",
  },
  // {
  //   title: "Case Studies",
  //   description: "Get up and running on new features and techniques",
  //   icon: "lucide:circle-play",
  // },
]
</script>
