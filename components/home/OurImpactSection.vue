<template>
  <div class="relative py-16 bg-light-blue">
    <div class="absolute top-0 right-0 hidden sm:block">
      <img src="~/assets/media/img/Line.svg" alt="" class="object-cover h-56" />
    </div>

    <div class="container grid grid-cols-1 sm:grid-cols-2">
      <div>
        <h6 class="text-sm font-medium text-orange-accent">OUR IMPACT</h6>
        <h1>Since 2014 we have come a long way</h1>
        <p class="font-light text-dark-gray">
          We are committed to making a lasting difference in the lives of people
        </p>
        <div
          class="grid grid-cols-1 mt-12 sm:grid-cols-2 text-dark-blue gap-y-12"
        >
          <div>
            <h1 class="text-7xl sm:text-4xl">
              {{ impactDetails.zakatBeneficiaries }}
            </h1>
            <p>Zakat Beneficiaries</p>
          </div>
          <div>
            <h1 class="text-7xl sm:text-4xl">
              {{ impactDetails.orphansWidowsSupported }}
            </h1>
            <p>Orphans and Widows Supported</p>
          </div>
          <div>
            <h1 class="text-7xl sm:text-4xl">
              {{ impactDetails.masjidBuilt }}
            </h1>
            <p>Masaajid Built</p>
          </div>
          <div>
            <h1 class="text-7xl sm:text-4xl">{{ impactDetails.wellsBuilt }}</h1>
            <p>Wells Built</p>
          </div>
        </div>
      </div>
      <div class="pt-8 md:pl-8 lg:pl-24 md:pt-20 lg:pt-10">
        <AspectRatio class="" :ratio="1 / 1.02">
          <img
            src="~/assets/media/img/5.png"
            alt=""
            class="object-cover w-full h-full rounded-2xl"
          />
        </AspectRatio>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const strapiFetch = useStrapiFetch()
const impactDetails = await strapiFetch("/our-impact", "GET")
  .then((res) => res.data.value.data)
  .catch((err) => {
    return {
      masjidBuilt: "13",
      wellsBuilt: "99",
      zakatBeneficiaries: "10K+",
      orphansWidowsSupported: "6K",
    }
  })
</script>
<style></style>
