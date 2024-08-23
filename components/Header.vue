<template>
  <div class="bg-dark-blue py-4 text-white">
    <div class="container flex justify-between">
      <NuxtLink :href="localePath('/')">
        <img :src="logo" alt="Annadaa" class="w-32" />
      </NuxtLink>
      <div class="hidden sm:flex items-center space-x-4 lg:space-x-8">
        <NuxtLink class="hover:text-gray-200" :href="localePath('/')"
          >Home</NuxtLink
        >
        <NuxtLink class="hover:text-gray-200" :href="localePath('/about')"
          >About</NuxtLink
        >
        <NuxtLink class="hover:text-gray-200" :href="localePath('/contact')"
          >Causes</NuxtLink
        >
        <NuxtLink class="hover:text-gray-200" :href="localePath('/learn')"
          >Learn</NuxtLink
        >
        <NuxtLink class="hover:text-gray-200" :href="localePath('/faq')"
          >FAQs</NuxtLink
        >
        <NuxtLink class="hover:text-gray-200" :href="localePath('/contact')"
          >Contact</NuxtLink
        >
      </div>
      <div class="hidden sm:flex items-center space-x-8">
        <NuxtLink
          :href="localePath('/login')"
          class="text-primary hover:text-blue-200"
          >Log in</NuxtLink
        >
        <Button>Donate</Button>
      </div>

      <div class="sm:hidden flex items-center">
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
