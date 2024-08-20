<template>
  <div class="bg-dark-blue py-4 text-white">
    <div class="container flex justify-between">
      <NuxtLink href="/">
        <img :src="logo" alt="Annadaa" class="w-32" />
      </NuxtLink>
      <div class="hidden sm:flex items-center space-x-8">
        <NuxtLink href="/">Home</NuxtLink>
        <NuxtLink href="/about">About</NuxtLink>
        <NuxtLink href="/contact">Causes</NuxtLink>
        <NuxtLink href="/learn">Learn</NuxtLink>
        <NuxtLink href="/faq">FAQs</NuxtLink>
        <NuxtLink href="/contact">Contact</NuxtLink>
      </div>
      <div class="hidden sm:flex items-center space-x-8">
        <NuxtLink class="text-primary">Log in</NuxtLink>
        <Button>Donate</Button>
      </div>

      <div class="sm:hidden flex items-center">
        <Icon class="text-3xl" name="lucide:align-justify" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import logo from "@/assets/media/img/logos/annadaa-white.svg"
</script>
<style lang=""></style>
