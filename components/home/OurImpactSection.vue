<template>
  <div class="bg-light-blue py-16 relative">
    <div class="hidden sm:block absolute top-0 right-0">
      <img src="~/assets/media/img/Line.svg" alt="" class="h-56 object-cover" />
    </div>

    <div class="container grid grid-cols-1 sm:grid-cols-2">
      <div>
        <h6 class="text-orange-accent text-sm font-medium">OUR IMPACT</h6>
        <h1>Since 2014 we have come a long way</h1>
        <p class="text-dark-gray font-light">
          We are committed to making a lasting difference in the lives of people
        </p>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 text-dark-blue gap-y-12 mt-12"
        >
          <div>
            <h1 class="text-7xl sm:text-4xl">10K+</h1>
            <p>Zakat Beneficiaries</p>
          </div>
          <div>
            <h1 class="text-7xl sm:text-4xl">6K</h1>
            <p>Orphans and Widows Supported</p>
          </div>
          <div>
            <h1 class="text-7xl sm:text-4xl">13</h1>
            <p>Masaajid Built</p>
          </div>
          <div>
            <h1 class="text-7xl sm:text-4xl">99+</h1>
            <p>Wells Built</p>
          </div>
        </div>
      </div>
      <div class="md:pl-8 lg:pl-16 pt-8 sm:pt-28">
        <AspectRatio class="" :ratio="1 / 1.02">
          <img
            src="~/assets/media/img/5.png"
            alt=""
            class="w-full h-full object-cover rounded-2xl"
          />
        </AspectRatio>
      </div>
    </div>
  </div>
</template>
<script lang="ts"></script>
<style></style>
