<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start"
    >
      <div>
        <h1 class="text-2xl font-medium sm:text-3xl">
          As-Salamu Alaikum,
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
          <div v-if="!loadingDonationStats" class="relative space-y-1">
            <p class="text-3xl font-semibold">
              {{ formatCurrency(donationStats?.totalAmountUSD ?? 0) }}
            </p>
            <Badge
              :variant="
                donationStats?.percentageChange?.totalAmountUSD === 0
                  ? 'payment-pending'
                  : donationStats?.percentageChange?.totalAmountUSD &&
                      donationStats?.percentageChange?.totalAmountUSD > 0
                    ? 'payment-success'
                    : 'payment-failed'
              "
              class="right-0 bottom-0 lg:absolute"
            >
              <span
                v-if="
                  donationStats?.percentageChange?.totalAmountUSD &&
                  donationStats?.percentageChange?.totalAmountUSD > 0
                "
                >↑</span
              >
              <span
                v-else-if="
                  donationStats?.percentageChange?.totalAmountUSD &&
                  donationStats?.percentageChange?.totalAmountUSD < 0
                "
                >↓</span
              >
              {{ donationStats?.percentageChange?.totalAmountUSD ?? 0 }}% vs
              last
              {{ timeframeAlts[timeframe as keyof typeof timeframeAlts] }}
            </Badge>
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
          <div v-if="!loadingDonationStats" class="relative space-y-1">
            <p class="text-3xl font-semibold">
              {{ donationStats?.totalDonations ?? 0 }}
            </p>
            <Badge
              :variant="
                donationStats?.percentageChange?.totalDonations === 0
                  ? 'payment-pending'
                  : donationStats?.percentageChange?.totalDonations &&
                      donationStats?.percentageChange?.totalDonations > 0
                    ? 'payment-success'
                    : 'payment-failed'
              "
              class="right-0 bottom-0 lg:absolute"
            >
              <span
                v-if="
                  donationStats?.percentageChange?.totalDonations &&
                  donationStats?.percentageChange?.totalDonations > 0
                "
                >↑</span
              >
              <span
                v-else-if="
                  donationStats?.percentageChange?.totalDonations &&
                  donationStats?.percentageChange?.totalDonations < 0
                "
                >↓</span
              >
              {{ donationStats?.percentageChange?.totalDonations ?? 0 }}% vs
              last
              {{ timeframeAlts[timeframe as keyof typeof timeframeAlts] }}
            </Badge>
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
                :class="breakdownView === 'category' ? 'bg-gray-100' : ''"
                @click="breakdownView = 'category'"
                class="px-2 h-7 text-xs"
              >
                By category
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="breakdownView === 'country' ? 'bg-gray-100' : ''"
                @click="breakdownView = 'country'"
                class="px-2 h-7 text-xs"
              >
                By location
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col justify-center items-center py-8">
            <PieChart
              v-if="donationStats && !loadingDonationStats"
              :data="donationStats as DonationData"
              :group-by="breakdownView"
            />
          </div>
        </CardContent>
      </Card>
      <DashboardMonthlyDonationsCard
        class="lg:col-span-2"
        :hide-show-all-link="false"
        :hide-dropdown-menu="true"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { StripeTransactionMetadata } from "@@/server/api/process-donation.post"
import type Stripe from "stripe"
import { useDateFormat } from "@vueuse/core"
import type { DonationData } from "@/components/PieChart.vue"

const { formatCurrency } = useMoneyFormat()
const formatDate = (date: string | number | Date) => {
  return useDateFormat(date, "DD/MM/YYYY").value
}

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
const breakdownView = ref<"category" | "country">("category")

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
  "donation-stats-" + Date.now(),
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
  data: monthlyDonations,
  pending: loadingMonthlyDonations,
  refresh: refreshMonthlyDonations,
} = await useAsyncData(
  "monthly-subscriptions-" + Date.now(),
  (): Promise<{
    data: (Stripe.Subscription & {
      metadata: StripeTransactionMetadata
    })[]
    success: boolean
  }> => {
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
</script>
