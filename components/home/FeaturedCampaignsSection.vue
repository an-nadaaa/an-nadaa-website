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

        <NuxtLink to="/causes">
          <Button class="hidden sm:block" :variant="'white'">View all</Button>
        </NuxtLink>
      </div>

      <!-- Campaign Cards -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-6">
        <!-- <template v-if="isLoading">
          <AspectRatio class="col-span-3" :ratio="506 / 520">
            <div class="w-full"></div>
          </AspectRatio>
          <AspectRatio class="col-span-3" :ratio="506 / 520">
            <div class="w-full h-full bg-black"></div>
          </AspectRatio>
        </template>
        <template v-else> -->
        <NuxtLink
          v-for="(cause, index) in causes.slice(0, 5)"
          :id="index"
          :to="'/causes/' + cause.documentId"
          :class="`${
            index === 0 || index === 1 ? 'sm:col-span-3' : 'sm:col-span-2'
          }
          ${index > 2 ? 'hidden' : ''} md:block col-span-1
          ${index === 2 || index === 3 ? 'md:col-span-3 lg:col-span-2' : ''}
          ${index === 4 ? 'md:hidden lg:block' : ''}
          
          `"
        >
          <CauseCard
            :cause="cause"
            class="hover:cursor-pointer hover:shadow-xl"
          ></CauseCard>
          <!-- <CauseCard
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
            /> -->
        </NuxtLink>
        <!-- </template> -->
      </div>

      <NuxtLink to="/causes">
        <Button class="w-full mt-6 sm:hidden" :variant="'white'"
          >View all</Button
        >
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const strapiFetch = useStrapiFetch()
const causes =
  (await strapiFetch(
    "/causes",
    "GET",
    {},
    {
      sort: "createdAt:desc",
      populate: "*",
      filters: {
        isFeatured: true,
        environment: process.env.NODE_ENV,
      },
      // fields: [
      //   "title",
      //   "isPrivate",
      //   "isActive",
      //   "locale",
      //   "raisedAmount",
      //   "causeStatus",
      //   "tags",
      // ],
    }
  ).then((res) => res.data.value.data)) || []

// const router = useRouter()
// const campaigns = [
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

<style scoped>
/* Add any additional styles here */
</style>
