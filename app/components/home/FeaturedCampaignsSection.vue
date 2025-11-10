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
        <NuxtLink
          v-for="(cause, index) in causes.slice(0, 5)"
          :id="index.toString()"
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
        // isActive: true,
        isPrivate: false,
        environment:
          process.env.NODE_ENV === "production" ? "production" : "development",
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
  ).then((res: any) => res.data.value.data)) || []
</script>
