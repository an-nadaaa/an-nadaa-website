<template>
  <HomeHeroSection />
  <HomeLogoCloudSection />
  <HomeFeaturedCampaignsSection />
  <HomeAboutUsSection />
  <HomeOurImpactSection />
  <!-- Todo: fix testimonials error -->
  <HomeTestimonialsSection :testimonials="testimonials" />
  <HomeFAQSection />
</template>
<script setup lang="ts">
const strapiFetch = useStrapiFetch()

const testimonials = await strapiFetch("/testimonials", "GET")
  .then((res) => {
    return res.data.value.data
  })
  .catch((err) => {
    console.error(err)
    return []
  })
</script>
<style></style>
