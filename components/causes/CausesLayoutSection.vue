<!-- todo: add featured tag on featured causes -->

<template>
  <div class="container py-6 sm:py-12">
    <!-- <h1>{{ categories }}</h1> -->
    <div
      :class="`grid sm:grid-cols-5 gap-x-3 p-1 gap-y-3 transition-all sm:h-fit ${
        isFilterExpanded ? ' h-fit pb-4' : 'h-0'
      } overflow-y-hidden overflow-x-visible `"
    >
      <div class="">
        <p class="select-label">Cause Type</p>
        <Select class="w-full" v-model="typeSelected">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent class="">
            <SelectGroup>
              <!-- <SelectLabel>Fruits</SelectLabel> -->
              <SelectItem
                v-for="(type, index) in causeType"
                :key="index"
                :value="type"
                >{{ type }}</SelectItem
              >
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

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

    <Button
      class="flex items-center justify-center w-full hover:bg-slate-300 hover:cursor-pointer sm:hidden gap-x-2"
      :variant="'white'"
      @click="isFilterExpanded = !isFilterExpanded"
    >
      <p class="text-dark-gray">
        {{ isFilterExpanded ? "Hide filters" : "Show filters" }}
      </p>
      <Icon
        :class="`transform transition-transform ${
          isFilterExpanded ? 'rotate-180' : ''
        }`"
        name="lucide:chevrons-down"
      />
    </Button>

    <VueSpinnerBars
      v-if="isLoading && isMounted"
      class="mx-auto my-48 text-5xl text-primary"
    />
    <div class="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3">
      <h2
        v-if="causes.length === 0 && !isLoading"
        class="my-32 font-light text-center text-gray-400 sm:col-span-2 lg:col-span-3"
      >
        Sorry, nothing found :(
      </h2>
      <NuxtLink
        v-if="!isLoading"
        v-for="(cause, index) in causes"
        :id="index"
        :to="'/causes/' + cause.documentId"
      >
        <CauseCard
          :cause="cause"
          class="hover:cursor-pointer hover:shadow-xl"
        />
      </NuxtLink>
    </div>
    <div
      v-if="causes.length > 0"
      class="flex justify-between w-full mt-4 gap-x-2"
    >
      <Button
        class="w-full sm:w-44"
        @click="handlePreviousPage"
        :disabled="previousDisabled"
        :variant="'white'"
      >
        <Icon name="lucide:arrow-left" class="mr-2" /> Previous
      </Button>

      <Button
        class="w-full sm:w-44"
        :disabled="nextDisabled"
        @click="handleNextPage"
        :variant="'white'"
      >
        Next <Icon class="ml-2" name="lucide:arrow-right" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VueSpinnerBars } from "vue3-spinners"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

const pageSize = 12
const route = useRoute()
const strapiFetch = useStrapiFetch()
const categories = await strapiFetch("/categories", "GET", {}).then(
  (res: any) => {
    return [
      "All",
      ...res.data.value.data.map((category: any) => category.title),
    ]
  }
)
const locations = await strapiFetch("/locations", "GET", {}).then(
  (res: any) => {
    return [
      "All",
      ...res.data.value.data.map((location: any) => location.countryName),
    ]
  }
)
const causeType = ["All", "Campaign", "Project"]
const states = ["All", "Ongoing", "Funded"]
const currentPage = ref(1)
const isFilterExpanded = ref(false)
const isLoading = ref(true)
const isMounted = ref(false)
const typeSelected = ref("All")
const categorySelected = ref("All")
const stateSelected = ref("All")
const locationSelected = ref("All")
const pagination = ref<Record<string, any>>({})
const previousDisabled = computed(() => currentPage.value === 1)
const nextDisabled = computed(
  () => pagination.value.page >= pagination.value.pageCount
)
const typeRef = computed(() => route.query.type)

if (route.query.type === "campaign" || route.query.type === "project") {
  typeSelected.value =
    route.query.type.charAt(0).toUpperCase() + route.query.type.slice(1)
}

function handleResetFilter() {
  categorySelected.value = "All"
  stateSelected.value = "All"
  locationSelected.value = "All"
  typeSelected.value = "All"
}

watch(typeRef, (value) => {
  if (value === "campaign" || value === "project") {
    typeSelected.value = value.charAt(0).toUpperCase() + value.slice(1)
  }
})

watch([categorySelected, stateSelected, locationSelected, typeSelected], () => {
  currentPage.value = 1
})

watch(
  [
    categorySelected,
    stateSelected,
    locationSelected,
    currentPage,
    typeSelected,
  ],
  () => {
    causes.value = []
  }
)

const causes = computedAsync(async () => {
  const qsQuery = {
    filters: {
      isActive: {
        $eq: true,
      },
      causeType:
        typeSelected.value === "All"
          ? {}
          : {
              $eq: typeSelected.value.toLowerCase(),
            },
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
      page: currentPage.value,
      pageSize,
    },
    populate: "*",
  }
  isLoading.value = true

  const { data: strapiResponse } = await strapiFetch(
    "/causes",
    "GET",
    {
      locale: "en",
    },
    qsQuery
  )

  // await new Promise((resolve) => setTimeout(resolve, 1000))

  isLoading.value = false

  pagination.value = strapiResponse.value.meta.pagination

  return strapiResponse.value.data
}, [])

function handleNextPage() {
  currentPage.value += 1
}

function handlePreviousPage() {
  currentPage.value -= 1
}

onMounted(() => {
  isMounted.value = true
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
// todo: filter to isActive: true
</script>

<style>
.select-label {
  @apply text-sm text-gray-600 mb-2;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
