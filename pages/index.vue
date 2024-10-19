<template>
  <HomeHeroSection />
  <HomeLogoCloudSection />
  <HomeFeaturedCampaignsSection />
  <HomeAboutUsSection />
  <HomeOurImpactSection />
  <HomeTestimonialsSection :testimonials="testimonials" />
  <HomeFAQSection />
</template>
<script setup lang="ts">
const strapiFetch = useStrapiFetch()

const testimonials = await strapiFetch("/testimonial", "GET")
  .then((res) => {
    return res.data.value.data
  })
  .catch((err) => {
    console.error(err)
    return []
  })
</script>
<style></style>
