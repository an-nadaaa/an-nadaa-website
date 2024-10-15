<template>
  <div class="container py-6 sm:py-12">
    <!-- <h1>{{ categories }}</h1> -->
    <div class="grid sm:grid-cols-4 gap-x-3 gap-y-3">
      <div class="">
        <p class="select-label">Category</p>
        <Select class="w-full" v-model="categorySelected">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent class="">
            <SelectGroup>
              <!-- <SelectLabel>Fruits</SelectLabel> -->
              <SelectItem
                v-for="(category, index) in categories"
                :key="index"
                :value="category"
                >{{ category }}</SelectItem
              >
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="">
        <p class="select-label">Campaign State</p>
        <Select class="w-full" v-model="stateSelected">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent class="">
            <SelectGroup>
              <!-- <SelectLabel>Fruits</SelectLabel> -->
              <SelectItem
                v-for="(state, index) in states"
                :key="index"
                :value="state"
                >{{ state }}</SelectItem
              >
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="">
        <p class="select-label">Locations</p>
        <Select class="w-full" v-model="locationSelected">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent class="">
            <SelectGroup>
              <!-- <SelectLabel>Fruits</SelectLabel> -->
              <SelectItem
                v-for="(location, index) in locations"
                :key="index"
                :value="location"
                >{{ location }}</SelectItem
              >
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <p
          @click="handleResetFilter"
          class="pt-2 ml-4 underline text-primary sm:pt-8 hover:cursor-pointer w-fit hover:font-medium"
        >
          Reset filter
        </p>
      </div>
    </div>
    <div class="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="(cause, index) in causes"
        :id="index"
        :to="'/causes/' + cause.documentId"
      >
        <HomeCampaignCardSection
          :key="cause.documentId"
          :title="cause.title"
          :categoryTags="cause.categories.map((category:any) => category.title)"
          :image="cause.images[0].formats.medium.url"
          :amountRaised="cause.raisedAmount"
          :goalAmount="cause.goalDetails[0].goalAmount"
          :status="cause.causeStatus"
          :funded="false"
          :tags="cause.tags.map((tag:any) => tag.value)"
          class="hover:cursor-pointer hover:shadow-xl"
        />
      </NuxtLink>
    </div>
  </div>
  <!-- <h1>{{ causes }}</h1> -->
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

const pageSize = 12
const currentIndex = ref(0)
const strapiFetch = useStrapiFetch()
const categories = await strapiFetch("/categories", "GET", {}).then((res) => {
  return ["All", ...res.data.value.data.map((category: any) => category.title)]
})
const locations = await strapiFetch("/locations", "GET", {}).then((res) => {
  return [
    "All",
    ...res.data.value.data.map((location: any) => location.countryName),
  ]
})
// const categories = ["All", "Education", "Food"]
const states = ["All", "Ongoing", "Funded"]
// const locations = ["All", "Nigeria", "Malaysia"]

const categorySelected = ref("All")
const stateSelected = ref("All")
const locationSelected = ref("All")

function handleResetFilter() {
  categorySelected.value = "All"
  stateSelected.value = "All"
  locationSelected.value = "All"
}

const causes = computedAsync(async () => {
  const qsQuery = {
    filters: {
      // category: {
      //   $eq: categorySelected.value === "All" ? null : categorySelected.value,
      // },
      categories: {
        title:
          categorySelected.value === "All"
            ? {}
            : {
                $eq: categorySelected.value,
              },
      },
      causeStatus:
        stateSelected.value === "All"
          ? {}
          : {
              $eq: stateSelected.value,
            },
      locations: {
        countryName:
          locationSelected.value === "All"
            ? {}
            : {
                $eq: locationSelected.value,
              },
      },
    },
    pagination: {
      start: currentIndex.value,
      limit: pageSize,
    },
    populate: "*",
  }
  const { data: strapiResponse } = await strapiFetch(
    "/causes",
    "GET",
    {
      locale: "en",
    },
    qsQuery
  )

  return strapiResponse.value.data
})

// const causes = [
//   {
//     id: 1,
//     title: "Sponsor a Child Education",
//     categoryTags: ["Education", "Sadaqah"],
//     image:
//       "https://wallpapers.com/images/hd/colorful-google-polka-dots-ot2t9bbzehsjggdx.jpg",
//     amountRaised: 4271,
//     goalAmount: 10650,
//     status: "Ongoing",
//     funded: false,
//     tags: ["20 days left"],
//   },
//   {
//     id: 2,
//     title: "Build a Masjid",
//     categoryTags: ["Sadaqah Jariyah"],
//     image:
//       "https://mrwallpaper.com/images/hd/vintage-google-website-7qgz2szwjhkoybl2.jpg",
//     amountRaised: 400,
//     goalAmount: 4271,
//     status: "Funded",
//     funded: true,
//   },
//   {
//     id: 2,
//     title: "Build a Masjid",
//     categoryTags: ["Sadaqah Jariyah"],
//     image:
//       "https://mrwallpaper.com/images/hd/vintage-google-website-7qgz2szwjhkoybl2.jpg",
//     amountRaised: 1700,
//     goalAmount: 4271,
//     status: "Funded",
//     funded: true,
//   },
//   {
//     id: 2,
//     title: "Build a Masjid",
//     categoryTags: ["Sadaqah Jariyah"],
//     image:
//       "https://mrwallpaper.com/images/hd/vintage-google-website-7qgz2szwjhkoybl2.jpg",
//     amountRaised: 2000,
//     goalAmount: 4271,
//     status: "Ongoing",
//     funded: true,
//   },
//   {
//     id: 2,
//     title: "Build a Masjid",
//     categoryTags: ["Sadaqah Jariyah"],
//     image:
//       "https://mrwallpaper.com/images/hd/vintage-google-website-7qgz2szwjhkoybl2.jpg",
//     amountRaised: 4271,
//     goalAmount: 4271,
//     status: "Funded",
//     funded: true,
//   },
//   // Add more campaigns as needed
// ]
</script>

<style>
.select-label {
  @apply text-sm text-gray-600 mb-2;
}
</style>
