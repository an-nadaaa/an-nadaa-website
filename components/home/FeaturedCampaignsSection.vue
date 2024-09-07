<template>
  <section class="my-16 featured-campaigns">
    <div class="container">
      <div class="flex justify-between mb-4">
        <div>
          <h1 class="text-sm text-orange-accent">OUTREACH AND CAMPAIGNS</h1>
          <h1 class="my-3 text-3xl font-semibold">
            We help build sustainable Islamic communities
          </h1>
          <p class="text-gray-500">
            We are committed to making a lasting difference in the lives of
            people.
          </p>
        </div>
        <Button class="hidden sm:block" :variant="'white'">View all</Button>
      </div>

      <!-- Campaign Cards -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-6">
        <CampaignCard
          v-for="(campaign, index) in campaigns.slice(0, 5)"
          :class="`${
            index === 0 || index === 1 ? 'sm:col-span-3' : 'sm:col-span-2'
          }
          ${index > 2 ? 'hidden' : ''} sm:block col-span-1`"
          :key="campaign.id"
          :title="campaign.title"
          :categoryTags="campaign.categoryTags"
          :image="campaign.image"
          :amountRaised="campaign.amountRaised"
          :goalAmount="campaign.goalAmount"
          :status="campaign.status"
          :funded="campaign.funded"
          :tags="campaign.tags"
          class="hover:cursor-pointer hover:shadow-xl"
          @click="() => router.push(`/causes/${campaign.id}`)"
        />
      </div>

      <Button class="w-full mt-6 sm:hidden" :variant="'white'">View all</Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import CampaignCard from "~/components/home/CampaignCardSection.vue"

const router = useRouter()
const campaigns = [
  {
    id: 1,
    title: "Sponsor a Child Education",
    categoryTags: ["Education", "Sadaqah"],
    image:
      "https://wallpapers.com/images/hd/colorful-google-polka-dots-ot2t9bbzehsjggdx.jpg",
    amountRaised: 4271,
    goalAmount: 10650,
    status: "Ongoing",
    funded: false,
    tags: ["20 days left"],
  },
  {
    id: 2,
    title: "Build a Masjid",
    categoryTags: ["Sadaqah Jariyah"],
    image:
      "https://mrwallpaper.com/images/hd/vintage-google-website-7qgz2szwjhkoybl2.jpg",
    amountRaised: 400,
    goalAmount: 4271,
    status: "Funded",
    funded: true,
  },
  {
    id: 2,
    title: "Build a Masjid",
    categoryTags: ["Sadaqah Jariyah"],
    image:
      "https://mrwallpaper.com/images/hd/vintage-google-website-7qgz2szwjhkoybl2.jpg",
    amountRaised: 1700,
    goalAmount: 4271,
    status: "Funded",
    funded: true,
  },
  {
    id: 2,
    title: "Build a Masjid",
    categoryTags: ["Sadaqah Jariyah"],
    image:
      "https://mrwallpaper.com/images/hd/vintage-google-website-7qgz2szwjhkoybl2.jpg",
    amountRaised: 2000,
    goalAmount: 4271,
    status: "Ongoing",
    funded: true,
  },
  {
    id: 2,
    title: "Build a Masjid",
    categoryTags: ["Sadaqah Jariyah"],
    image:
      "https://mrwallpaper.com/images/hd/vintage-google-website-7qgz2szwjhkoybl2.jpg",
    amountRaised: 4271,
    goalAmount: 4271,
    status: "Funded",
    funded: true,
  },
  // Add more campaigns as needed
]
</script>

<style scoped>
/* Add any additional styles here */
</style>
