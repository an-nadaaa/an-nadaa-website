<template>
  <div class="space-y-6 max-w-full">
    <!-- Header Section -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start"
    >
      <div>
        <h1 class="text-xl font-light text-gray-500">Total Donations</h1>
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
      </TabsList>
    </Tabs>
    
    <DonationsChart :donations="chartDonations" :timeframe="timeframe" />

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
      <div class="">
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-normal">Donation history</h4>
          <div class="flex gap-2">
            <Popover v-model:open="listDatePickerOpen" @update:open="onListDatePickerOpenChange">
              <PopoverTrigger as-child>
                <Button variant="outline">
                  <Icon name="lucide:calendar" class="mr-1 w-4 h-4" />
                  {{ listDateRange?.start && listDateRange?.end
                    ? `${listDateRange.start.day.toString().padStart(2, '0')}/${listDateRange.start.month.toString().padStart(2, '0')}/${listDateRange.start.year.toString()} to ${listDateRange.end.day.toString().padStart(2, '0')}/${listDateRange.end.month.toString().padStart(2, '0')}/${listDateRange.end.year.toString()}`
                    : "Select dates" }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="p-0 w-auto" align="start">
                <RangeCalendar
                  v-model="dateRangePicker"
                  class="rounded-md border shadow-sm"
                  :number-of-months="2"
                  disable-days-outside-current-view
                />
                <div class="flex gap-2 justify-end p-3 border-t">
                  <Button
                    v-if="listDateRange"
                    variant="outline"
                    size="sm"
                    @click="clearListDateRange"
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    @click="applyListDateRange"
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div class="">
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
                  <!-- <TableHead class="w-[50px]">Invoice</TableHead> -->
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="donation in donations?.data"
                  :key="donation.id"
                >
                  <TableCell>
                    <div class="flex gap-2 items-center">
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
                            (() => {
                              const percent = Math.round(
                                (parseFloat(donation.cause?.raisedAmount) /
                                  parseFloat(
                                    donation.cause?.goalDetails[0].goalAmount
                                  )) *
                                  100
                              )
                              return isNaN(percent) ? 0 : percent
                            })(),
                            3
                          )
                        "
                      />
                      <p>
                        {{
                          (() => {
                            const numerator = parseFloat(donation.cause?.raisedAmount)
                            const denominator = parseFloat(donation.cause?.goalDetails[0].goalAmount)
                            let percent = Math.round((numerator / denominator) * 100)
                            if (isNaN(percent)) percent = 0
                            return percent
                          })()
                        }}%
                      </p>
                    </div>
                    <Badge
                      v-else-if="donation.cause"
                      :variant="
                        donation.cause?.isActive
                          ? 'campaign-ongoing'
                          : 'campaign-funded'
                      "
                      class="px-2"
                      showCircle
                    >
                      {{ donation.cause?.isActive ? "Ongoing" : "Closed" }}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="w-8 h-8"
                        >
                          <Icon name="lucide:ellipsis-vertical" class="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" class="w-48">
                        <DropdownMenuItem @select="() => openDonationDrawer(donation as DonationRow)">
                          <Icon name="lucide:file-text" class="w-4 h-4" /> View Donation
                        </DropdownMenuItem>
                        <a :href="donation.invoiceUrl" target="_blank" rel="noopener noreferrer">
                          <DropdownMenuItem>
                            <Icon name="lucide:external-link" class="w-4 h-4" /> View Receipt
                          </DropdownMenuItem>
                        </a>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div
            v-else-if="
              !loadingDonations &&
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
                <template v-if="!listDateRange">
                  <p class="text-base font-medium">
                    You haven't made donation yet
                  </p>
                  <p class="text-sm text-gray-500">Come back later</p>
                </template>
                <template v-else>
                  <p class="text-base font-medium">
                    No donations found
                  </p>
                  <p class="text-sm text-gray-500">Make sure to donate frequently :)</p>
                </template>
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

        <!-- <div class="order-1 lg:order-2 lg:col-span-2">
          <DashboardMonthlyDonationsCard
            :hide-show-all-link="true"
            :hide-dropdown-menu="false"
          />
        </div> -->
      </div>
    </div>

    <!-- Donation details drawer (right) -->

    <Drawer direction="right" v-model:open="donationDrawerOpen">
      <DrawerContent direction="right" class="flex flex-col">
        <template v-if="selectedDonation">
          <DrawerHeader class="text-left p-6 pb-0">
            <div class="flex justify-between items-start pr-2 relative">
              <div class="flex flex-col gap-2">
                <DrawerTitle class=" font-normal">Donation Details</DrawerTitle>
                <DrawerDescription>See donation details below.</DrawerDescription>
              </div>
              <DrawerClose as-child>
                <Button variant="ghost" size="icon" class="h-4 w-4 absolute right-0 top-0">
                  <Icon name="lucide:x" class="w-4 h-4" />
                  <span class="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div class="border-b my-5"></div>
          <div class="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <!-- AMOUNT DONATED -->
            <div class="space-y-1">
              <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">Amount donated</p>
              <p class="text-3xl font-normal">
                {{ formatCurrency(selectedDonation.amount as number, (selectedDonation.currency as string).toUpperCase()) }}
              </p>
            </div>
            <template v-if="selectedDonation.cause">
              <!-- CAMPAIGN -->
              <div class="space-y-1">
                <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">Cause</p>
                <template v-if="selectedDonation.cause">
                  <p class="font-normal mb-0">{{ selectedDonation.cause.title }}</p>
                  <NuxtLink
                    :to="$localePath(`/causes/${selectedDonation.cause.documentId}`)"
                    class="text-sm text-primary hover:underline"
                  >
                    an-nadaa.com{{ $localePath(`/causes/${selectedDonation.cause.documentId}`) }}
                  </NuxtLink>
                </template>
                <p v-else class="text-sm">{{ selectedDonation.causeTitle || 'General Donation' }}</p>
              </div>
              <!-- DATE & TIME -->
              <div class="space-y-1">
                <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date & time</p>
                <p class="text-sm">{{ formatDateWithTime(selectedDonation.createdAt as string) }}</p>
              </div>
              <!-- PAYMENT STATUS -->
              <div class="space-y-1">
                <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment status</p>
                <Badge variant="payment-success" class="px-2" showCircle>
                  {{ (selectedDonation.donationStatus as string).charAt(0).toUpperCase() + (selectedDonation.donationStatus as string).slice(1) }}
                </Badge>
              </div>
              <CauseCard
                :cause="selectedDonation.cause"
                class="hover:cursor-pointer"
              />
            </template>
            <template v-else>
              <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">Cause</p>
              <p class="font-normal text-gray-600 text-center">Cause not found</p>
            </template>
            <!-- CAMPAIGN STATUS (when cause exists with goal) -->
            <!-- <div v-if="selectedDonation.cause" class="space-y-2">
              <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Campaign status</p>
              <div class="rounded-lg border p-3 space-y-2">
                <img
                  v-if="selectedDonation.cause.thumbnail?.formats?.medium?.url || selectedDonation.cause.thumbnail?.url || selectedDonation.cause.coverImage?.url"
                  :src="selectedDonation.cause.thumbnail?.formats?.medium?.url || selectedDonation.cause.thumbnail?.url || selectedDonation.cause.coverImage?.url"
                  :alt="selectedDonation.cause.title"
                  class="w-full h-24 object-cover rounded-md"
                />
                <div v-else class="w-full h-24 rounded-md bg-muted flex items-center justify-center">
                  <Icon name="lucide:image" class="w-8 h-8 text-muted-foreground" />
                </div>
                <div v-if="selectedDonation.cause.categories?.length" class="flex flex-wrap gap-1">
                  <Badge
                    v-for="(category, i) in selectedDonation.cause.categories"
                    :key="i"
                    variant="secondary"
                    class=" font-normal text-gray-800"
                  >
                    {{ category.title }}
                  </Badge>
                </div>
                <p class="text-sm font-medium">
                  {{ selectedDonation.cause.goalDetails?.[0]?.projectDescription || selectedDonation.cause.title }}
                </p>
                <template v-if="selectedDonation.cause.goalDetails?.[0]?.goalAmount != null && selectedDonation.cause.raisedAmount != null">
                  <Progress
                    class="h-2 [&>div]:bg-primary"
                    :model-value="Math.min(100, Math.max(0, (parseFloat(selectedDonation.cause.raisedAmount) / parseFloat(selectedDonation.cause.goalDetails[0].goalAmount)) * 100))"
                  />
                  <p class="text-xs text-muted-foreground">
                    {{ formatCurrency(parseFloat(selectedDonation.cause.raisedAmount), 'USD') }} of {{ formatCurrency(parseFloat(selectedDonation.cause.goalDetails[0].goalAmount), 'USD') }} Raised
                  </p>
                </template>
              </div>
            </div> -->
            <!-- RECEIPT -->
            <div class="space-y-1">
              <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">Receipt</p>
              <template v-if="selectedDonation.invoiceUrl">
                <div
                  class="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Icon name="lucide:file-text" class="w-8 h-8 text-muted-foreground shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">View Receipt</p>
                  </div>
                    <a :href="selectedDonation.invoiceUrl" target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" class="w-8 h-8">
                        <Icon name="lucide:external-link" class="w-4 h-4 shrink-0" />
                        <span class="sr-only">View Receipt</span>
                      </Button>
                    </a>
                </div>
              </template>
              <p v-else class="text-sm text-muted-foreground">Receipt not available</p>
            </div>
          </div>
          <DrawerFooter class="pt-4 border-t">
            <DrawerClose as-child>
              <Button variant="outline" class="w-full">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </template>
      </DrawerContent>
    </Drawer>

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
import type { DateRange } from "reka-ui"
import { getLocalTimeZone, today } from "@internationalized/date"
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RangeCalendar } from "@/components/ui/range-calendar"
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
const { formatDayMonthYear } = useDateFormatter()

// Pagination
const pageSize = ref(20)
const currentPage = ref(1)

// List date filter (donation history table)
const listDatePickerOpen = ref(false)
const listDateRange = ref<DateRange | null>(null)
const defaultPickerRange = (): DateRange => {
  const t = today(getLocalTimeZone())
  return { start: t.subtract({ days: 30 }), end: t } as DateRange
}
const dateRangePicker = ref<DateRange>(defaultPickerRange())

function onListDatePickerOpenChange(open: boolean) {
  if (open) {
    if (listDateRange.value?.start != null && listDateRange.value?.end != null) {
      dateRangePicker.value = {
        start: listDateRange.value.start,
        end: listDateRange.value.end,
      } as DateRange
    } else {
      dateRangePicker.value = defaultPickerRange()
    }
  }
}

function applyListDateRange() {
  if (dateRangePicker.value?.start && dateRangePicker.value?.end) {
    listDateRange.value = {
      start: dateRangePicker.value.start,
      end: dateRangePicker.value.end,
    } as DateRange
    currentPage.value = 1
    refreshDonations()
  }
  listDatePickerOpen.value = false
}

function clearListDateRange() {
  listDateRange.value = null
  listDatePickerOpen.value = false
  currentPage.value = 1
  refreshDonations()
}

const timeframeAlts = {
  "12months": "12 months",
  "30days": "30 days",
  "7days": "7 days",
}
const timeframe = ref("12months")

// Window: from now back by the selected duration (UTC)
const dateWindow = computed(() => {
  const end = new Date()
  const start = new Date(end)
  switch (timeframe.value) {
    case "7days":
      start.setUTCDate(start.getUTCDate() - 7)
      break
    case "30days":
      start.setUTCDate(start.getUTCDate() - 30)
      break
    case "12months":
      start.setUTCMonth(start.getUTCMonth() - 12)
      break
    default:
      start.setUTCDate(start.getUTCDate() - 30)
  }
  return {
    windowStart: start.toISOString(),
    windowEnd: end.toISOString(),
  }
})

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
  () =>
    `donations-list-${currentPage.value}-${pageSize.value}-${
      listDateRange.value?.start && listDateRange.value?.end
        ? `${listDateRange.value.start.toString()}-${listDateRange.value.end.toString()}`
        : "all"
    }`,
  () => {
    const query: Record<string, number | string> = {
      page: currentPage.value,
      pageSize: pageSize.value,
    }
    if (listDateRange.value?.start && listDateRange.value?.end) {
      const start = listDateRange.value.start
      const end = listDateRange.value.end
      // Treat calendar dates as local: start of start day and end of end day, then to UTC ISO for backend
      const startLocal = new Date(start.year, start.month - 1, start.day, 0, 0, 0, 0)
      const endLocal = new Date(end.year, end.month - 1, end.day, 23, 59, 59, 999)
      query.startDate = startLocal.toISOString()
      query.endDate = endLocal.toISOString()
    }
    return $fetch("/api/dashboard/donations", {
      method: "GET",
      query,
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

const {
  data: chartDonationsData,
  refresh: refreshChartDonations,
} = await useAsyncData<
  APIResponseCollection<"api::donation.donation"> & {
    data: (ApiDonationDonation & { cause: any | null })[]
  }
>(
  () => `donations-chart-${timeframe.value}`,
  () => {
    const { windowStart, windowEnd } = dateWindow.value
    return $fetch("/api/dashboard/donations", {
      method: "GET",
      query: {
        page: 1,
        pageSize: 1000,
        startDate: windowStart,
        endDate: windowEnd,
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

watch([currentPage, pageSize], () => {
  refreshDonations()
})

watch(timeframe, () => {
  refreshChartDonations()
  refreshDonationStats()
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

const { data: donationStats, pending: loadingDonationStats, refresh: refreshDonationStats } =
  await useAsyncData(
    () => `donation-stats-${timeframe.value}`,
    () => {
      const { windowStart, windowEnd } = dateWindow.value
      return $fetch("/api/dashboard/donation-stats", {
        method: "GET",
        query: {
          startDate: windowStart,
          endDate: windowEnd,
        },
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

// Chart data: build { [isoDatetime]: { amount, currency, amountUSD? } } for DonationsChart.
// Add sentinel entries at window start and end (0 value) so the chart always shows the full window.
const chartDonations = computed(() => {
  const { windowStart, windowEnd } = dateWindow.value
  const record: Record<string, { amount: number; currency: string; amountUSD?: number }> = {}

  if (chartDonationsData.value?.data) {
    const list = chartDonationsData.value.data
    list.forEach((donation: any, i: number) => {
      const key = donation.createdAt ? `${donation.createdAt}_${i}` : `unknown_${i}`
      record[key] = {
        amount: Number(donation.amount) ?? 0,
        currency: (donation.currency as string) ?? "USD",
        amountUSD: donation.amountUSD != null ? Number(donation.amountUSD) : undefined,
      }
    })
  }

  record[`${windowStart}_start`] = { amount: 0, currency: "USD" }
  record[`${windowEnd}_end`] = { amount: 0, currency: "USD" }
  return record
})

// Helpers
function formatDate(date: any) {
  return formatDayMonthYear(date, "MMMM D, YYYY")
}

function formatDateWithTime(date: string | Date | number | undefined | null) {
  if (date == null) return ""
  const dateTimeStr = toValue(formatDayMonthYear(date, "MMM D, YYYY [at] HH:mm"))
  const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(new Date(date as string | Date | number))
  const tzPart = parts.find((p) => p.type === "timeZoneName")
  const tzName = tzPart?.value ?? ""
  return tzName ? `${dateTimeStr} ${tzName}` : dateTimeStr
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

// Donation details drawer (right-side)
const donationDrawerOpen = ref(false)
/** Donation row as returned by the API (document shape with populated cause) */
type DonationRow = {
  id?: number
  documentId?: string
  amount: number
  currency: string
  amountUSD?: number
  cause: any | null
  causeTitle?: string
  createdAt: string
  donationStatus: string
  invoiceUrl?: string | null
  source?: string
  donationType?: string
  [key: string]: unknown
}
const selectedDonation = ref<DonationRow | null>(null)
function openDonationDrawer(donation: DonationRow) {
  selectedDonation.value = donation
  donationDrawerOpen.value = true
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
