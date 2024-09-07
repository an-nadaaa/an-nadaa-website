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
        <NuxtLink class="hover:text-gray-200" :to="localePath('/causes')"
          >Causes</NuxtLink
        >
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

const localePath = useLocalePath()
</script>
