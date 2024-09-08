<template>
  <div class="py-4 text-white bg-dark-blue">
    <div class="container flex justify-between">
      <NuxtLink :href="localePath('/')">
        <img :src="logo" alt="Annadaa" class="w-32" />
      </NuxtLink>
      <div class="items-center hidden space-x-4 sm:flex lg:space-x-8">
        <NuxtLink class="hover:text-gray-200" :to="localePath('/')"
          >Home</NuxtLink
        >
        <NuxtLink class="hover:text-gray-200" :to="localePath('/about')"
          >About</NuxtLink
        >

        <div class="flex items-center h-full pr-0 lg:pr-2">
          <HoverCard :openDelay="100">
            <HoverCardTrigger>
              <NuxtLink class="hover:text-gray-200" :to="localePath('/causes')">
                <div class="flex gap-x-1">
                  <div class="">Causes</div>
                  <div>
                    <Icon
                      class="absolute hidden lg:block text-xl translate-y-[2px]"
                      name="lucide:chevron-down"
                    ></Icon>
                  </div>
                </div>
              </NuxtLink>
            </HoverCardTrigger>
            <HoverCardContent class="w-72">
              <div class="grid gap-y-4">
                <div
                  class="grid grid-cols-6 align-middle"
                  v-for="(item, index) in causesLinks"
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
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <NuxtLink class="hover:text-gray-200" :to="localePath('/faq')"
          >FAQs</NuxtLink
        >
        <NuxtLink class="hover:text-gray-200" :to="localePath('/contact')"
          >Contact</NuxtLink
        >
      </div>
      <div class="items-center hidden space-x-8 sm:flex">
        <NuxtLink
          :to="localePath('/login')"
          class="text-primary hover:text-blue-200"
          >Log in</NuxtLink
        >
        <NuxtLink :to="localePath('/donate')">
          <Button>Donate</Button>
        </NuxtLink>
      </div>

      <div class="flex items-center sm:hidden">
        <Icon class="text-3xl" name="lucide:align-justify" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// @ts-ignore
import logo from "~/assets/media/img/logos/annadaa-white.svg"

const isHovering = ref(false)
const localePath = useLocalePath()
const causesLinks = [
  {
    title: "Campaigns",
    description: "Opportunities to help those in need",
    icon: "lucide:book",
  },
  {
    title: "Projects",
    description: "A perpetual way to give to those who need it most",
    icon: "lucide:sparkles",
  },
  {
    title: "Case Studies",
    description: "Get up and running on new features and techniques",
    icon: "lucide:circle-play",
  },
]
</script>
