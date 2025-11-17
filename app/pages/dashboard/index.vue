<template>
  {{ monthlySubscriptions }}
  <div class="space-y-6">
    <!-- Header Section -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
    >
      <div>
        <h1 class="text-2xl font-medium sm:text-3xl">
          As-Salamu'Alaikum,
          {{
            user?.user.username
              ? user.user.username.charAt(0).toUpperCase() +
                user.user.username.slice(1)
              : ""
          }}
        </h1>
        <p class="mt-1 text-sm text-gray-400 sm:text-base">
          See all donations you have made so far
        </p>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row sm:space-x-3">
        <!-- <Button variant="outline" class="w-full sm:w-auto">
          <Icon name="lucide:cloud-download" class="mr-2" />Export Donations
        </Button> -->
        <NuxtLink :to="$localePath('/causes')">
          <Button class="w-full sm:w-auto">Donate</Button>
        </NuxtLink>
      </div>
    </div>

    <!-- Date Filter Section -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
    >
      <Tabs v-model="timeframe" default-value="30days" class="w-full sm:w-auto">
        <TabsList class="grid grid-cols-4 w-full sm:w-auto sm:inline-flex">
          <TabsTrigger value="12months" class="text-xs sm:text-sm">
            12 months
          </TabsTrigger>
          <TabsTrigger value="30days" class="text-xs sm:text-sm">
            30 days
          </TabsTrigger>
          <TabsTrigger value="7days" class="text-xs sm:text-sm">
            7 days
          </TabsTrigger>
          <TabsTrigger value="1day" class="text-xs sm:text-sm"
            >1 Day</TabsTrigger
          >
        </TabsList>
      </Tabs>
      <!-- <Button variant="outline" class="w-full sm:w-auto">
        <Icon name="lucide:calendar" class="mr-2" />Select dates
      </Button> -->
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <!-- Total Amount Donated Card -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base font-medium"
            >Total Amount Donated</CardTitle
          >
        </CardHeader>
        <CardContent>
          <div v-if="!loadingDonationStats" class="space-y-1">
            <p class="text-3xl font-semibold">
              {{ formatCurrency(donationStats?.totalAmountUSD ?? 0) }}
            </p>
            <p class="text-sm text-orange-500">
              ↑ 0% vs last
              {{ timeframeAlts[timeframe as keyof typeof timeframeAlts] }}
            </p>
          </div>
          <div v-else>
            <Skeleton class="w-24 h-12"></Skeleton>
          </div>
        </CardContent>
      </Card>

      <!-- Number of donations made Card -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base font-medium"
            >Number of donations made</CardTitle
          >
        </CardHeader>
        <CardContent>
          <div v-if="!loadingDonationStats" class="space-y-1">
            <p class="text-3xl font-semibold">
              {{ donationStats?.totalDonations ?? 0 }}
            </p>
            <p class="text-sm text-orange-500">
              ↑ 0% vs last
              {{ timeframeAlts[timeframe as keyof typeof timeframeAlts] }}
            </p>
          </div>
          <div v-else>
            <Skeleton class="w-24 h-12"></Skeleton>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Breakdown and Top Donations Section -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <!-- Breakdown of donations Card -->
      <Card class="lg:col-span-3">
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle class="text-base font-medium"
              >Breakdown of donations</CardTitle
            >
            <div class="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                :class="breakdownView === 'campaigns' ? 'bg-gray-100' : ''"
                @click="breakdownView = 'campaigns'"
                class="px-2 h-7 text-xs"
              >
                By campaigns
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="breakdownView === 'locations' ? 'bg-gray-100' : ''"
                @click="breakdownView = 'locations'"
                class="px-2 h-7 text-xs"
              >
                By locations
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col justify-center items-center py-8">
            <!-- Simple Donut Chart Placeholder -->
            <div class="relative w-48 h-48 sm:w-56 sm:h-56">
              <svg
                class="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  stroke-width="8"
                />
              </svg>
              <div
                class="flex absolute inset-0 flex-col justify-center items-center"
              >
                <p class="text-2xl font-semibold">0</p>
                <p class="text-sm text-gray-500">Donations</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Top 5 Donations made Card -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle class="text-base font-medium"
              >Your Monthly Donations</CardTitle
            >
            <Button variant="ghost" size="icon" class="w-8 h-8">
              <Icon name="lucide:more-vertical" class="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col justify-center items-center py-8 space-y-4">
            <!-- Empty State Illustration -->
            <img src="/img/designing-a-website.png" class="w-32 h-32" />
            <!-- <div
              class="flex justify-center items-center w-32 h-32 bg-gray-100 rounded-lg"
            >
              <Icon name="lucide:tablet" class="w-16 h-16 text-gray-400" />
            </div> -->
            <div class="space-y-2 text-center">
              <p class="text-base font-medium">
                You haven't subscribed to any monthly donations yet
              </p>
              <p class="text-sm text-gray-500">Invest in your akhirah</p>
            </div>
            <NuxtLink :to="$localePath('/causes')">
              <Button class="mt-4">Donate now</Button>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const { formatCurrency } = useMoneyFormat()
definePageMeta({
  layout: "dashboard",
})

const { user } = useUserSession()

const timeframeAlts = {
  "12months": "12 months",
  "30days": "30 days",
  "7days": "7 days",
  "1day": "1 day",
}
// const { fetchUser } = useStrapiAuth()
const timeframe = ref("30days")
const breakdownView = ref<"campaigns" | "locations">("campaigns")

const startDate = computed(() => {
  if (timeframe.value === "12months") {
    return new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    ).toISOString()
  } else if (timeframe.value === "30days") {
    return new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
  } else if (timeframe.value === "7days") {
    return new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
  } else if (timeframe.value === "1day") {
    return new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
  }

  return undefined
})

const {
  data: donationStats,
  pending: loadingDonationStats,
  refresh: refreshDonationStats,
} = await useAsyncData(
  "donation-stats",
  () => {
    return $fetch("/api/dashboard/donation-stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      query: {
        startDate: startDate.value,
      },
    })
  },
  {
    lazy: true,
    server: false,
  }
)

const {
  data: monthlySubscriptions,
  pending: loadingMonthlySubscriptions,
  refresh: refreshMonthlySubscriptions,
} = await useAsyncData(
  "monthly-subscriptions",
  () => {
    return $fetch("/api/dashboard/monthly-donations", {
      method: "GET",
    })
  },
  {
    lazy: true,
    server: false,
  }
)

watch(timeframe, () => {
  refreshDonationStats()
})

// const user = await fetchUser()
// const user = useStrapiUser()

// const user = useStrapiUser()
// const token = useStrapiToken()

// watchEffect(() => {
//   if (user.value == null) {
//     return navigateTo("/login")
//   }
// })
</script>
