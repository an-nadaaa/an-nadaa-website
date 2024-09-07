<template>
  <div class="container py-6 sm:py-12">
    <div class="grid sm:grid-cols-4 gap-x-3 gap-y-3">
      <div class="">
        <p class="select-label">Category</p>
        <Select class="w-full">
          <SelectTrigger>
            <SelectValue :placeholder="categories[0]" />
          </SelectTrigger>
          <SelectContent class="">
            <SelectGroup>
              <!-- <SelectLabel>Fruits</SelectLabel> -->
              <SelectItem
                v-for="(category, index) in categories"
                :key="index"
                :value="category.toLowerCase()"
                >{{ category }}</SelectItem
              >
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="">
        <p class="select-label">Campaign State</p>
        <Select class="w-full">
          <SelectTrigger>
            <SelectValue :placeholder="states[0]" />
          </SelectTrigger>
          <SelectContent class="">
            <SelectGroup>
              <!-- <SelectLabel>Fruits</SelectLabel> -->
              <SelectItem
                v-for="(state, index) in states"
                :key="index"
                :value="state.toLowerCase()"
                >{{ state }}</SelectItem
              >
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="">
        <p class="select-label">Locations</p>
        <Select class="w-full">
          <SelectTrigger>
            <SelectValue :placeholder="locations[0]" />
          </SelectTrigger>
          <SelectContent class="">
            <SelectGroup>
              <!-- <SelectLabel>Fruits</SelectLabel> -->
              <SelectItem
                v-for="(location, index) in locations"
                :key="index"
                :value="location.toLowerCase()"
                >{{ location }}</SelectItem
              >
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <p class="pt-2 ml-4 underline text-primary sm:pt-8">Reset filter</p>
      </div>
    </div>
    <div class="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3">
      <HomeCampaignCardSection
        v-for="(campaign, index) in campaigns"
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
  </div>
</template>

<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

const router = useRouter()
const categories = ["All", "Education", "Food"]
const states = ["All", "Ongoing", "Funded"]
const locations = ["All", "Nigeria", "Malaysia"]
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

<style>
.select-label {
  @apply text-sm text-gray-600 mb-2;
}
</style>
