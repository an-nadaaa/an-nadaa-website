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
        <Icon @click="show" class="text-3xl" name="lucide:align-justify" />
      </div>
    </div>
    <!-- Mobile Navigation -->
    <div
      class="z-[1000] container fixed w-screen h-screen top-0 sm:hidden bg-dark-blue transition-transform transform"
      :class="mobileNavigationVisible ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex justify-between py-4">
        <NuxtLink @click="hide" :href="localePath('/')">
          <img :src="logo" alt="Annadaa" class="w-32" />
        </NuxtLink>

        <div class="flex items-center sm:hidden">
          <Icon @click="hide" class="text-3xl" name="lucide:align-justify" />
        </div>
      </div>
      <div class="grid grid-cols-1 mt-8 gap-y-6">
        <div
          v-for="(link, index) in links"
          :key="index"
          class="w-full text-lg text-white"
        >
          <template v-if="link.title !== 'Causes'">
            <NuxtLink @click="hide" :to="localePath(link.path)">
              <div class="text-lg w-max">
                {{ link.title }}
              </div>
            </NuxtLink>
          </template>
          <template v-else>
            <div>
              <Accordion class="p-0" type="single" collapsible>
                <AccordionItem class="p-0 border-b-0" value="item-1">
                  <AccordionTrigger class="text-lg font-normal"
                    >Causes</AccordionTrigger
                  >
                  <AccordionContent class="pb-0">
                    <NuxtLink
                      v-for="(item, index) in causesLinks"
                      @click="hide"
                      :key="index"
                      :to="item.path"
                    >
                      <div
                        class="flex items-center mt-4 rounded-sm hover:text-gray-200"
                      >
                        <h5 class="font-light text-md">{{ item.title }}</h5>
                      </div>
                    </NuxtLink>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </template>
        </div>
        <NuxtLink :to="localePath('/donate')" @click="hide">
          <Button class="w-full py-6 my-6 text-lg"> Donate now</Button>
        </NuxtLink>
        <div class="flex space-x-6 text-gray-400">
          <NuxtLink :to="'https://twitter.com'">
            <Icon class="text-3xl" name="akar-icons:twitter-fill" />
          </NuxtLink>
          <NuxtLink :to="'https://linkedin.com'">
            <Icon class="text-3xl" name="akar-icons:linkedin-box-fill" />
          </NuxtLink>
          <NuxtLink :to="'https://facebook.com'">
            <Icon class="text-3xl" name="akar-icons:facebook-fill" />
          </NuxtLink>
          <NuxtLink :to="'https://www.youtube.com/@annadaaedu'">
            <Icon class="text-3xl" name="akar-icons:youtube-fill" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <div
    class="fixed sm:hidden bottom-0 px-4 py-5 z-[99] w-full bg-dark-blue transition-transform transform"
    :class="
      donateButtonVisible && !isCheckoutOrDonate
        ? 'translate-y-0'
        : 'translate-y-full'
    "
  >
    <p class="text-lg text-center text-white">Donate for the sake of Allah</p>
    <NuxtLink :to="'/donate'">
      <Button class="w-full mt-4">Donate now</Button>
    </NuxtLink>
  </div>
  <!-- <NuxtLink :to="'/donate'">
    <div
      v-if="!isButtonVisible"
      class="fixed bottom-0 z-[100] w-full py-3 sm:hidden bg-primary"
    >
      <p class="text-lg text-center text-white">Donate now</p>
    </div>
  </NuxtLink> -->
</template>
<script setup lang="ts">
import { useElementVisibility } from "@vueuse/core"
import { useDonateButton } from "~/composables/useDonateButton"
import { useMobileNavigation } from "~/composables/useMobileNavigation"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const isCauseOpen = ref(false)
const isMobileCauseOpen = ref(false)
const donateButton = ref(null)
const { mobileNavigationVisible, showMobileNavigation, hideMobileNavigation } =
  useMobileNavigation()

const appConfig = useAppConfig()
const logo = appConfig.logo.white
const localePath = useLocalePath()
const route = useRoute()
const isCheckoutOrDonate = computed(() => {
  return (
    ["/checkout", "/donate", "/causes"].includes(route.path) ||
    /^\/causes\/[a-zA-Z0-9]+$/.test(route.path)
  )
})

const show = () => {
  showMobileNavigation()
  document.body.style.overflow = "hidden"
}

const hide = () => {
  hideMobileNavigation()
  document.body.style.overflow = "auto"
}

// const hideDonateButton = ref(false)
const { donateButtonVisible } = useDonateButton()
const links = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Causes", path: "/causes" },
  { title: "Blogs", path: "/blogs" },
  { title: "FAQs", path: "/faq" },
  { title: "Contact", path: "/contact" },
]
const causesLinks = [
  {
    title: "All",
    description: "Discover all causes",
    icon: "lucide:align-justify",
    path: "/causes?type=all",
  },

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
