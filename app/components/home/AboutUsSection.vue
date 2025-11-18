<template>
  <div class="py-20 overflow-hidden lg:py-42">
    <div class="container">
      <div class="w-full max-w-[750px] mx-auto space-y-4">
        <h6 class="text-sm font-medium text-center text-orange-accent">
          ABOUT US
        </h6>
        <h1 class="font-semibold text-center">
          An-Nadaa is a non-profit organisation working since 2014 and
          registered in Nigera and Malaysia.
        </h1>
        <p class="text-center text-dark-gray">
          An-Nadaa started with the renovation of a school building in Zaria
          (Nigeria), since then An-Nadaa has established multiple awqaaf
          (endowments) and completed many projects in fields of health,
          education, dawah, tarbiyah, water and poverty alleviation.
        </p>
        <p class="text-center text-dark-gray">
          An-Nadaa projects are in Zaria and its surrounding. We pray that Allah
          gives us capability to expand our project outwards and cover whole of
          Nigeria and then onwards to the whole of African continent.
        </p>
        <div class="flex justify-center w-full">
          <NuxtLink to="/about">
            <Button>Learn more about us</Button>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div
      class="w-[120%] relative -left-[30px] sm:left-1/2 sm:-translate-x-1/2 grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mt-16"
    >
      <div class="flex items-center col-span-1">
        <AspectRatio :ratio="1.05 / 1">
          <img
            src="~/assets/media/img/1.png"
            alt=""
            class="object-cover w-full h-full rounded-xl"
          />
        </AspectRatio>
      </div>
      <div class="col-span-1">
        <AspectRatio :ratio="5 / 6.5">
          <img
            src="~/assets/media/img/4.png"
            alt=""
            class="object-cover w-full h-full rounded-xl"
          />
        </AspectRatio>
      </div>
      <div class="flex items-center col-span-1">
        <AspectRatio :ratio="1.05 / 1">
          <img
            src="~/assets/media/img/5.png"
            alt=""
            class="object-cover w-full h-full rounded-xl"
          />
        </AspectRatio>
      </div>
      <div class="hidden col-span-1 sm:block">
        <AspectRatio :ratio="5 / 6.5">
          <img
            src="~/assets/media/img/3.png"
            alt=""
            class="object-cover w-full h-full rounded-xl"
          />
        </AspectRatio>
      </div>
      <div class="items-center hidden col-span-1 sm:flex">
        <AspectRatio :ratio="1.05 / 1">
          <img
            src="~/assets/media/img/6.png"
            alt=""
            class="object-cover w-full h-full rounded-xl"
          />
        </AspectRatio>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style></style>
