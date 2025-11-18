<template>
  <div class="space-y-6 max-w-full">
    <!-- Header Section -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start"
    >
      <div>
        <h1 class="text-xl font-light">Total Donations</h1>
        <Skeleton v-if="loadingDonationStats" class="w-24 h-12"></Skeleton>
        <p v-else class="mt-2 text-3xl font-medium sm:text-4xl">
          {{ formatCurrency(donationStats?.totalAmountUSD ?? 0) }}
        </p>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <!-- <Button variant="outline" class="w-full sm:w-auto">
          <Icon name="lucide:download" class="mr-2 w-4 h-4" />
          Export Donations
        </Button> -->
        <NuxtLink :to="$localePath('/causes')">
          <Button class="w-full sm:w-auto">Donate</Button>
        </NuxtLink>
      </div>
    </div>

    <!-- Time Filter Tabs -->
    <!-- <Tabs v-model="timeframe" default-value="12months" class="w-full">
      <TabsList class="grid grid-cols-3 w-full sm:w-auto sm:inline-flex">
        <TabsTrigger value="12months" class="text-xs sm:text-sm">
          12 months
        </TabsTrigger>
        <TabsTrigger value="30days" class="text-xs sm:text-sm">
          30 days
        </TabsTrigger>
        <TabsTrigger value="7days" class="text-xs sm:text-sm">
          7 days
        </TabsTrigger>
      </TabsList>
    </Tabs> -->

    <!-- Donation History Section -->
    <div class="space-y-4">
      <!-- <div
        class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
      >
        <h2 class="text-xl font-medium">Donation history</h2>
        <div class="flex flex-col gap-2 sm:flex-row">
          <Popover v-model:open="datePickerOpen">
            <PopoverTrigger as-child>
              <Button variant="outline" class="w-full sm:w-auto">
                <Icon name="lucide:calendar" class="mr-2 w-4 h-4" />
                Select dates
              </Button>
            </PopoverTrigger>
            <PopoverContent class="p-0 w-auto" align="start">
              <div class="p-4">
                <p class="mb-2 text-sm text-muted-foreground">
                  Date range picker
                </p>
                <p class="text-xs text-muted-foreground">
                  Date picker implementation would go here
                </p>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" class="w-full sm:w-auto">
            <Icon name="lucide:filter" class="mr-2 w-4 h-4" />
            Apply filter
          </Button>
        </div>
      </div> -->

      <!-- <VueSpinnerBars
        v-if="loadingDonations"
        class="mx-auto my-48 text-5xl text-primary"
      /> -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div class="order-2 lg:order-1 lg:col-span-3">
          <!-- Table -->
          <div
            v-if="
              !loadingDonations &&
              donations?.data?.length &&
              donations?.data?.length > 0
            "
            class="overflow-x-auto w-full"
          >
            <Table class="border-b-[0.1px] border-gray-100">
              <TableHeader>
                <TableRow class="[&>th]:text-sm [&>th]:font-medium">
                  <TableHead class="min-w-[200px]">Cause</TableHead>
                  <TableHead class="min-w-[50px]">Amount</TableHead>
                  <TableHead class="min-w-[150px]">Cause progress</TableHead>
                  <TableHead class="min-w-[120px]">Date</TableHead>
                  <TableHead class="min-w-[120px]">Payment Status</TableHead>
                  <TableHead class="min-w-[120px]">Payment method</TableHead>
                  <TableHead class="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="donation in donations?.data"
                  :key="donation.id"
                >
                  <TableCell>
                    <div class="flex gap-2">
                      <p
                        v-if="
                          !donation.causeTitle || donation.causeTitle === ''
                        "
                        class="font-light"
                      >
                        General Donation
                      </p>
                      <NuxtLink
                        v-else-if="donation.cause"
                        :to="`/causes/${donation.cause?.documentId}`"
                        class="font-light hover:underline text-primary"
                      >
                        {{ donation.cause?.title }}
                      </NuxtLink>
                      <p v-else class="font-light">
                        {{ donation.causeTitle }}
                      </p>
                      <div
                        v-if="donation.donationType === 'monthly'"
                        class="inline-block relative group"
                      >
                        <Badge class="text-[10px] w-fit">
                          <Icon name="lucide:repeat" class="w-2 h-2" />
                        </Badge>
                        <div
                          class="hidden absolute left-1/2 z-10 px-2 py-1 mt-2 min-w-max text-xs text-white whitespace-nowrap bg-gray-900 rounded transition -translate-x-1/2 group-hover:block"
                        >
                          Recurring payment
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span class="font-light text-gray-500">
                      {{
                        formatCurrency(
                          donation.amount as number,
                          (donation.currency as string).toUpperCase()
                        )
                      }}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div
                      v-if="donation.cause?.causeType === 'campaign'"
                      class="flex gap-3 items-center"
                    >
                      <Progress
                        class="[&>div]:bg-primary h-2"
                        :model-value="
                          Math.max(
                            Math.round(
                              (parseFloat(donation.cause?.raisedAmount) /
                                parseFloat(
                                  donation.cause?.goalDetails[0].goalAmount
                                )) *
                                100
                            ),
                            3
                          )
                        "
                      />
                      <p>
                        {{
                          Math.round(
                            (parseFloat(donation.cause?.raisedAmount) /
                              parseFloat(
                                donation.cause?.goalDetails[0].goalAmount
                              )) *
                              100
                          )
                        }}%
                      </p>
                    </div>
                    <Badge
                      v-else-if="donation.cause"
                      :variant="
                        donation.cause?.isActive
                          ? 'campaign-funded'
                          : 'campaign-ongoing'
                      "
                      class="px-2"
                      showCircle
                    >
                      {{ donation.cause?.isActive ? "Active" : "Inactive" }}
                    </Badge>

                    <!-- {{ donation.cause.causeType }} -->
                    <!-- {{
                      Math.round(
                        (parseFloat(donation.cause?.raisedAmount) /
                          parseFloat(donation.cause?.goalDetails[0].goalAmount)) *
                          100
                      )
                    }}
                    {{ donation.cause?.goalDetails[0].goalAmount }} -->
                    <!-- <div class="flex gap-2 items-center"> 
                       <Badge
                        v-if="donation.cause.causeType === 'project'"
                        :variant="
                          donation.cause?.isActive
                            ? 'campaign-funded'
                            : 'campaign-ongoing'
                        "
                        class="px-2"
                        showCircle
                      >
                        {{ donation.cause?.isActive ? "Active" : "Inactive" }}
                      </Badge>
                      <div v-else class="flex gap-2 items-center">
                        <Progress
                          :model-value="
                            Math.max(
                              parseFloat(donation.cause?.raisedAmount) /
                                parseFloat(
                                  donation.cause?.goalDetails[0].goalAmount
                                ),
                              5
                            )
                          "
                        />
                        <p>
                          {{
                            Math.round(
                              (parseFloat(donation.cause?.raisedAmount) /
                                parseFloat(
                                  donation.cause?.goalDetails[0].goalAmount
                                )) *
                                100
                            )
                          }}%
                        </p>
                      </div>
                    </div> -->
                  </TableCell>
                  <TableCell>
                    <span class="font-light text-gray-500">{{
                      formatDate(donation.createdAt as string)
                    }}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="payment-success" class="px-2" showCircle>
                      Success
                    </Badge>
                    <!-- <Badge
                      variant="default"
                      class="flex gap-1.5 items-center w-fit"
                    >
                      {{ donation.paymentStatus }}
                    </Badge> -->
                  </TableCell>
                  <TableCell>
                    <!-- Todo: Change this for other payment methods -->
                    <span class="font-light">{{
                      (donation.source as string).charAt(0).toUpperCase() +
                      (donation.source as string).slice(1)
                    }}</span>
                  </TableCell>
                  <TableCell>
                    <!-- <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="icon" class="w-8 h-8">
                          <Icon name="lucide:more-vertical" class="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Icon name="lucide:file-text" class="mr-2 w-4 h-4" />
                          View donation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Icon name="lucide:download" class="mr-2 w-4 h-4" />
                          Download receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> -->
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div
            v-else-if="
              !loadingDonations &&
              donations?.data?.length &&
              donations?.data?.length === 0
            "
          >
            <div
              class="flex flex-col justify-center items-center py-8 space-y-4"
            >
              <!-- Empty State Illustration -->
              <img src="/img/designing-a-website.png" class="w-32 h-32" />
              <!-- <div
                  class="flex justify-center items-center w-32 h-32 bg-gray-100 rounded-lg"
                >
                  <Icon name="lucide:tablet" class="w-16 h-16 text-gray-400" />
                </div> -->
              <div class="space-y-2 text-center">
                <p class="text-base font-medium">
                  You haven't made donation yet
                </p>
                <p class="text-sm text-gray-500">Come back later</p>
              </div>
              <NuxtLink :to="$localePath('/causes')">
                <Button class="mt-4">Donate now</Button>
              </NuxtLink>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="
              donations?.meta?.pagination &&
              donations.meta.pagination.pageCount > 0 &&
              !loadingDonations
            "
            class="flex justify-between items-center mt-4 w-full"
          >
            <!-- Previous Button -->
            <button
              :disabled="!canGoToPrevious"
              :class="[
                'flex gap-2 items-center text-sm',
                canGoToPrevious
                  ? 'text-gray-500 cursor-pointer hover:underline hover:text-gray-700'
                  : 'text-gray-300 cursor-not-allowed',
              ]"
              @click="goToPreviousPage"
            >
              <Icon name="lucide:arrow-left" class="w-4 h-4" />
              <span class="hidden sm:inline">Previous</span>
            </button>

            <!-- Desktop: Page Numbers -->
            <div class="hidden gap-1 items-center md:flex">
              <template v-for="pageNum in visiblePages" :key="pageNum">
                <button
                  v-if="pageNum !== 'ellipsis'"
                  :class="[
                    'px-3 py-1.5 text-sm rounded-md transition-colors',
                    pageNum === currentPage
                      ? 'bg-gray-200 text-gray-800 font-medium shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                  ]"
                  @click="goToPage(pageNum as number)"
                >
                  {{ pageNum }}
                </button>
                <span v-else class="px-2 text-gray-500">...</span>
              </template>
            </div>

            <!-- Mobile: Page Input -->
            <div class="flex gap-2 items-center md:hidden">
              <span class="text-sm text-gray-500">Page</span>
              <input
                v-model.number="pageInput"
                type="number"
                :min="1"
                :max="totalPages"
                class="px-2 py-1 w-12 text-sm text-center rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent no-spinner"
                @keyup.enter="goToPageFromInput"
                @blur="goToPageFromInput"
                style="appearance: textfield; -moz-appearance: textfield"
              />
              <span class="text-sm text-gray-500">of {{ totalPages }}</span>
            </div>

            <!-- Next Button -->
            <button
              :disabled="!canGoToNext"
              :class="[
                'flex gap-2 items-center text-sm',
                canGoToNext
                  ? 'text-gray-500 cursor-pointer hover:underline hover:text-gray-700'
                  : 'text-gray-300 cursor-not-allowed',
              ]"
              @click="goToNextPage"
            >
              <span class="hidden sm:inline">Next</span>
              <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="order-1 lg:order-2 lg:col-span-2">
          <DashboardMonthlyDonationsCard
            :hide-show-all-link="true"
            :hide-dropdown-menu="false"
          />
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent class="sm:max-w-[425px] max-w-11/12 rounded-lg">
        <DialogHeader>
          <DialogTitle>{{ getDialogTitle() }}</DialogTitle>
          <DialogDescription>
            {{ getDialogDescription() }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="gap-2 rounded-b-lg">
          <DialogClose as-child>
            <Button variant="outline" :disabled="isProcessing"> Cancel </Button>
          </DialogClose>
          <Button
            type="button"
            @click="handleSubscriptionAction"
            :disabled="isProcessing"
            :variant="dialogAction === 'cancel' ? 'destructive' : 'default'"
          >
            <span v-if="isProcessing">Processing...</span>
            <span v-else>{{ getConfirmButtonText() }}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { StripeTransactionMetadata } from "@@/server/api/process-donation.post"
import type Stripe from "stripe"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { APIResponseCollection } from "@@/types/strapi/types"
import type {
  ApiCauseCause,
  ApiDonationDonation,
} from "@@/types/strapi/contentTypes"
import { useToast } from "@/components/ui/toast"

definePageMeta({
  layout: "dashboard",
})

const { toast } = useToast()
const { formatCurrency } = useMoneyFormat()
const { formateDayMonthYear } = useDateFormatter()

// Pagination
const pageSize = ref(20)
const currentPage = ref(1)

// Timeframe state
const timeframe = ref("12months")

const {
  data: donations,
  pending: loadingDonations,
  error,
  refresh: refreshDonations,
} = await useAsyncData<
  APIResponseCollection<"api::donation.donation"> & {
    data: (ApiDonationDonation & { cause: any | null })[]
  }
>(
  "donations-" + Date.now(),
  () => {
    return $fetch("/api/dashboard/donations", {
      method: "GET",
      query: {
        page: currentPage.value,
        pageSize: pageSize.value,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return res.data as any
    })
  },
  {
    lazy: true,
    server: false,
  }
)

// Watch for page changes and refresh data
watch([currentPage, pageSize], () => {
  refreshDonations()
})

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

const { data: donationStats, pending: loadingDonationStats } =
  await useAsyncData(
    "donation-stats",
    () => {
      return $fetch("/api/dashboard/donation-stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    },
    {
      lazy: true,
      server: false,
    }
  )

// Chart data
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]
const fullMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const chartData = computed(() => {
  const data = months.map((month, index) => {
    // Mock data - in real app, this would come from API
    const amount = Math.random() * 1000 + 500
    return {
      month: fullMonths[index],
      monthShort: month,
      amount,
      x: 50 + (index * 700) / 11,
      y: 250 - (amount / 1500) * 200,
    }
  })
  return data
})

const hoveredIndex = ref<number | null>(null)

// Generate SVG paths for line and area
const linePath = computed(() => {
  const points = chartData.value
  if (points.length === 0) return ""
  const firstPoint = points[0]
  if (!firstPoint) return ""
  let path = `M ${firstPoint.x} ${firstPoint.y}`
  for (let i = 1; i < points.length; i++) {
    const point = points[i]
    if (point) {
      path += ` L ${point.x} ${point.y}`
    }
  }
  return path
})

const areaPath = computed(() => {
  const points = chartData.value
  if (points.length === 0) return ""
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  if (!firstPoint || !lastPoint) return ""
  let path = `M ${firstPoint.x} 250 L ${firstPoint.x} ${firstPoint.y}`
  for (let i = 1; i < points.length; i++) {
    const point = points[i]
    if (point) {
      path += ` L ${point.x} ${point.y}`
    }
  }
  path += ` L ${lastPoint.x} 250 Z`
  return path
})

// Helpers
function formatDate(date: any) {
  return formateDayMonthYear(date, "MMMM D, YYYY")
}

const datePickerOpen = ref(false)

// Pagination computed properties
const totalPages = computed(() => {
  return donations.value?.meta?.pagination?.pageCount ?? 0
})

const canGoToPrevious = computed(() => {
  return currentPage.value > 1
})

const canGoToNext = computed(() => {
  return currentPage.value < totalPages.value
})

// Page input for mobile
const pageInput = ref(1)

// Watch currentPage to update pageInput
watch(
  currentPage,
  (newPage) => {
    pageInput.value = newPage
  },
  { immediate: true }
)

// Generate visible page numbers
const visiblePages = computed(() => {
  const pages: (number | "ellipsis")[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first 3 pages
    pages.push(1, 2, 3)

    if (current <= 4) {
      // Current page is in first 3 or page 4
      if (current === 4) {
        pages.push(4, "ellipsis")
      } else {
        pages.push("ellipsis")
      }
    } else if (current >= total - 2) {
      // Current page is in last 3
      pages.push("ellipsis")
    } else {
      // Current page is in the middle (5 to total-3)
      pages.push("ellipsis", current, "ellipsis")
    }

    // Always show last 3 pages
    pages.push(total - 2, total - 1, total)
  }

  return pages
})

// Pagination functions
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
  }
}

function goToPreviousPage() {
  if (canGoToPrevious.value) {
    currentPage.value = currentPage.value - 1
  }
}

function goToNextPage() {
  if (canGoToNext.value) {
    currentPage.value = currentPage.value + 1
  }
}

function goToPageFromInput() {
  const page = Number(pageInput.value)
  if (page >= 1 && page <= totalPages.value) {
    goToPage(page)
  } else {
    // Reset to current page if invalid
    pageInput.value = currentPage.value
  }
}

// Subscription management
const dialogOpen = ref(false)
const dialogAction = ref<"pause" | "resume" | "cancel" | null>(null)
const selectedSubscriptionId = ref<string | null>(null)
const isProcessing = ref(false)

async function openConfirmDialog(
  action: "pause" | "resume" | "cancel",
  subscriptionId: string
) {
  dialogAction.value = action
  selectedSubscriptionId.value = subscriptionId
  dialogOpen.value = true
}

async function closeDialog() {
  dialogOpen.value = false
  dialogAction.value = null
  selectedSubscriptionId.value = null
}

async function handleSubscriptionAction() {
  if (!selectedSubscriptionId.value || !dialogAction.value) return

  isProcessing.value = true
  try {
    await $fetch("/api/dashboard/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        subscriptionId: selectedSubscriptionId.value,
        action: dialogAction.value,
      },
    })

    toast({
      title: "Subscription updated",
      description: "Your subscription has been updated successfully",
      variant: "default",
    })
    // Refresh monthly donations after action
    await refreshMonthlyDonations()
    closeDialog()
  } catch (error) {
    console.error("Error managing subscription:", error)
    // You might want to show a toast notification here
    toast({
      title: "Error updating subscription",
      description: "An error occurred while updating your subscription",
      variant: "destructive",
    })
  } finally {
    isProcessing.value = false
  }
}

function getDialogTitle() {
  switch (dialogAction.value) {
    case "pause":
      return "Pause Subscription"
    case "resume":
      return "Resume Subscription"
    case "cancel":
      return "Cancel Subscription"
    default:
      return "Confirm Action"
  }
}

function getDialogDescription() {
  switch (dialogAction.value) {
    case "pause":
      return "Are you sure you want to pause this subscription? You can resume it later."
    case "resume":
      return "Are you sure you want to resume this subscription? It will continue charging monthly."
    case "cancel":
      return "Are you sure you want to cancel this subscription? This action cannot be undone."
    default:
      return "Please confirm this action."
  }
}

function getConfirmButtonText() {
  switch (dialogAction.value) {
    case "pause":
      return "Pause"
    case "resume":
      return "Resume"
    case "cancel":
      return "Cancel Subscription"
    default:
      return "Confirm"
  }
}
</script>

<style>
input.no-spinner::-webkit-outer-spin-button,
input.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input.no-spinner {
  -moz-appearance: textfield;
}
</style>
