<template>
  <div class="bg-dark-blue pt-8 pb-16 sm:py-20">
    <div
      class="container grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:gap-x-8 lg:gap-x-32"
    >
      <div class="text-white h-full flex flex-col justify-center">
        <h1 class="md:text-3xl lg:text-6xl space w-full leading-normal">
          Educate, Empower & Improve
        </h1>
        <p class="mt-4 text-lg sm:text-base lg:mt-6 font-light w-full">
          An-Nadaa started with the renovation of a single school building in
          2014, since then it has grown into an organisation that has
          established Awqaaf and executed many projects and is building the
          community through education and welfare causes. An-Nadaa is an
          officially registered Non-Profit Organisation by the Malaysian and
          Nigerian governments.
        </p>
      </div>
      <div>
        <AspectRatio :ratio="1 / 1.1">
          <img
            src="~/assets/media/img/Class.png"
            alt="About An-Nadaa"
            class="h-full w-full object-cover rounded-2xl"
          />
        </AspectRatio>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style></style>
