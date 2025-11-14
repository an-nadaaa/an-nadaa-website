<template>
  {{ donations }}
  <div class="space-y-6">
    <!-- Header Section -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start"
    >
      <div>
        <h1 class="text-xl font-light">Total Donations</h1>
        <p class="mt-2 text-3xl font-medium sm:text-4xl">
          {{ formatCurrency(totalDonations) }}
        </p>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" class="w-full sm:w-auto">
          <Icon name="lucide:download" class="mr-2 w-4 h-4" />
          Export Donations
        </Button>
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
      <div
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
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <Table class="outline-none">
          <TableHeader>
            <TableRow class="[&>th]:text-sm [&>th]:font-medium">
              <TableHead class="min-w-[200px]">Campaign</TableHead>
              <TableHead class="min-w-[100px]">Amount</TableHead>
              <TableHead class="min-w-[150px]">Campaign status</TableHead>
              <TableHead class="min-w-[120px]">Date</TableHead>
              <TableHead class="min-w-[120px]">Payment Status</TableHead>
              <TableHead class="min-w-[120px]">Payment method</TableHead>
              <TableHead class="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="donation in paginatedDonations" :key="donation.id">
              <TableCell>
                <div class="flex flex-col">
                  <NuxtLink
                    :to="`/causes/${donation.causeId}`"
                    class="font-light hover:underline"
                  >
                    {{ donation.campaign }}
                  </NuxtLink>
                </div>
              </TableCell>
              <TableCell>
                <span class="font-light text-gray-500">
                  {{ formatCurrency(donation.amount) }}
                </span>
              </TableCell>
              <TableCell>
                <div class="flex gap-2 items-center">
                  <Progress
                    :model-value="donation.campaignProgress"
                    class="w-20 h-2 sm:w-32 [&_div]:bg-[#149ec7]"
                  />
                  <span
                    class="hidden text-xs font-medium text-muted-foreground sm:inline"
                  >
                    {{ donation.campaignProgress }}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span class="font-light text-gray-500">{{
                  formatDate(donation.date)
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
                <span class="font-light">{{ donation.paymentMethod }}</span>
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

      <!-- Todo: Pagination -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

definePageMeta({
  layout: "dashboard",
})

const { user } = useUserSession()
const { formatCurrency } = useMoneyFormat()
const { formateDayMonthYear } = useDateFormatter()

// Timeframe state
const timeframe = ref("12months")

// Mock donation data
interface Donation {
  id: number
  campaign: string
  causeId: number
  amount: number
  campaignProgress: number
  date: string
  paymentStatus: "Success" | "Failed" | "Refunded" | "Pending"
  paymentMethod: string
}

const { data: donations } = await useAsyncData("donations", async () => {
  return await $fetch("/api/dashboard/donations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
})

// const donations = ref<Donation[]>([
//   {
//     id: 1,
//     campaign: "Botswana Dawah Center",
//     causeId: 33,
//     amount: 244.0,
//     campaignProgress: 60,
//     date: "2015-11-28",
//     paymentStatus: "Refunded",
//     paymentMethod: "Card Payment",
//   },
//   {
//     id: 2,
//     campaign: "Botswana Dawah Center",
//     causeId: 33,
//     amount: 244.0,
//     campaignProgress: 60,
//     date: "2015-07-14",
//     paymentStatus: "Failed",
//     paymentMethod: "Card Payment",
//   },
//   {
//     id: 3,
//     campaign: "Botswana Dawah Center",
//     causeId: 33,
//     amount: 244.0,
//     campaignProgress: 10,
//     date: "2013-08-24",
//     paymentStatus: "Success",
//     paymentMethod: "Card Payment",
//   },
//   {
//     id: 4,
//     campaign: "Botswana Dawah Center",
//     causeId: 33,
//     amount: 244.0,
//     campaignProgress: 60,
//     date: "2013-09-09",
//     paymentStatus: "Refunded",
//     paymentMethod: "Card Payment",
//   },
//   {
//     id: 5,
//     campaign: "Botswana Dawah Center",
//     causeId: 33,
//     amount: 244.0,
//     campaignProgress: 100,
//     date: "2012-05-06",
//     paymentStatus: "Pending",
//     paymentMethod: "Card Payment",
//   },
//   {
//     id: 6,
//     campaign: "Botswana Dawah Center",
//     causeId: 33,
//     amount: 244.0,
//     campaignProgress: 60,
//     date: "2017-11-07",
//     paymentStatus: "Pending",
//     paymentMethod: "Card Payment",
//   },
//   {
//     id: 7,
//     campaign: "Botswana Dawah Center",
//     causeId: 33,
//     amount: 244.0,
//     campaignProgress: 50,
//     date: "2015-02-09",
//     paymentStatus: "Success",
//     paymentMethod: "Direct Transfer",
//   },
// ])

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

// Total donations
const totalDonations = computed(() => {
  // return donations.value.reduce((sum, d) => sum + d.amount, 0)
  return 0
})

// Pagination
const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalPages = computed(
  () =>
    // Math.ceil(donations.value.length / itemsPerPage.value)
    0
)

const paginatedDonations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  // return donations.value.slice(start, end)
  return []
})

const visiblePages = computed(() => {
  const pages: (number | "ellipsis")[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 10) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push("ellipsis")
      pages.push(total - 1)
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push(2)
      pages.push("ellipsis")
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push(2)
      pages.push("ellipsis")
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push("ellipsis")
      pages.push(total - 1)
      pages.push(total)
    }
  }

  return pages
})

// Helpers
function formatDate(date: string) {
  return formateDayMonthYear(date, "MMMM D, YYYY")
}

function getStatusVariant(
  status: Donation["paymentStatus"]
): "default" | "success" | "destructive" | "warning" | "outline" {
  switch (status) {
    case "Success":
      return "success"
    case "Failed":
      return "destructive"
    case "Refunded":
      return "default"
    case "Pending":
      return "warning"
    default:
      return "outline"
  }
}

function getStatusDotClass(status: Donation["paymentStatus"]) {
  switch (status) {
    case "Success":
      return "bg-green-500"
    case "Failed":
      return "bg-red-500"
    case "Refunded":
      return "bg-blue-500"
    case "Pending":
      return "bg-orange-500"
    default:
      return "bg-gray-500"
  }
}

const datePickerOpen = ref(false)
</script>
