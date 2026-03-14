<template>
  <Drawer direction="right" v-model:open="openModel">
      <DrawerContent direction="right" class="flex flex-col">
        <template v-if="selectedDonation">
          <DrawerHeader class="p-6 pb-0 text-left">
            <div class="flex relative justify-between items-start pr-2">
              <div class="flex flex-col gap-2">
                <DrawerTitle class="font-normal">Donation Details</DrawerTitle>
                <DrawerDescription>See donation details below.</DrawerDescription>
              </div>
              <DrawerClose as-child>
                <Button variant="ghost" size="icon" class="absolute top-0 right-0 w-4 h-4">
                  <Icon name="lucide:x" class="w-4 h-4" />
                  <span class="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div class="my-5 border-b"></div>
          <div class="overflow-y-auto flex-1 px-6 pb-6 space-y-6">

            <div class="space-y-1">
              <p class="text-xs font-medium tracking-wide uppercase text-muted-foreground">Amount donated</p>
              <p class="text-3xl font-normal">
                {{ formatCurrency(selectedDonation.amount as number, (selectedDonation.currency as string).toUpperCase()) }}
              </p>
            </div>

            <template v-if="selectedDonation.cause">

              <div class="space-y-1">
                <p class="text-xs font-medium tracking-wide uppercase text-muted-foreground">Cause</p>
                <template v-if="selectedDonation.cause">
                  <p class="mb-0 font-normal">{{ selectedDonation.cause.title }}</p>
                  <NuxtLink
                    :to="$localePath(`/causes/${selectedDonation.cause.documentId}`)"
                    class="text-sm text-primary hover:underline"
                  >
                    an-nadaa.com{{ $localePath(`/causes/${selectedDonation.cause.documentId}`) }}
                  </NuxtLink>
                </template>
                <p v-else class="text-sm">{{ selectedDonation.causeTitle || 'General Donation' }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-medium tracking-wide uppercase text-muted-foreground">Date & time</p>
                <p class="text-sm">{{ formatDateWithTime(selectedDonation.createdAt as string) }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-medium tracking-wide uppercase text-muted-foreground">Payment status</p>
                <Badge variant="payment-success" class="px-2" showCircle>
                  {{ (selectedDonation.donationStatus as string).charAt(0).toUpperCase() + (selectedDonation.donationStatus as string).slice(1) }}
                </Badge>
              </div>
              <CauseCard
                :cause="selectedDonation.cause"
                class="hover:cursor-pointer"
              />
            </template>
            <template v-else-if="!selectedDonation.causeTitle || selectedDonation.causeTitle === ''">
              <p class="text-sm text-muted-foreground">
                This is a general donation. Your contribution supports An-Nadaa's work across causes.
              </p>
            </template>
            <template v-else>
              <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Cause</p>
              <p class="font-normal text-center text-gray-400">Cause not found</p>
            </template>

            <!-- Monthly subscription controls (above Receipt); hide when cancelled (no subscription after load) -->
            <div
              v-if="selectedDonation.donationType === 'monthly' && (subscriptionLoading || subscriptionForSelectedDonation)"
              class="space-y-1"
            >
              <p class="text-xs font-medium tracking-wide uppercase text-muted-foreground">Monthly subscription</p>
              <div class="p-3 space-y-3 rounded-lg border">
                <template v-if="subscriptionLoading">
                  <Skeleton class="w-3/4 h-4" />
                  <div class="grid grid-cols-1 gap-2 pt-1">
                    <Skeleton class="w-full h-9" />
                    <Skeleton class="w-full h-9" />
                  </div>
                </template>
                <template v-else>
                  <p
                    v-if="subscriptionForSelectedDonation.status === 'active' && !subscriptionForSelectedDonation.pause_collection"
                    class="text-xs text-muted-foreground"
                  >
                    Next payment on {{ formatDate(subscriptionForSelectedDonation.current_period_end * 1000) }}
                  </p>
                  <p v-else class="text-xs text-muted-foreground">Paused</p>
                  <div class="grid grid-cols-1 gap-2">
                    <Button
                      v-if="subscriptionForSelectedDonation.status === 'active' && !subscriptionForSelectedDonation.pause_collection"
                      variant="outline"
                      size="sm"
                      @click="openConfirmDialog('pause', subscriptionForSelectedDonation.id)"
                    >
                      <Icon name="lucide:pause" class="mr-1 w-4 h-4" />
                      Pause
                    </Button>
                    <Button
                      v-else-if="subscriptionForSelectedDonation.status === 'active' && subscriptionForSelectedDonation.pause_collection"
                      variant="outline"
                      size="sm"
                      @click="openConfirmDialog('resume', subscriptionForSelectedDonation.id)"
                    >
                      <Icon name="lucide:play" class="mr-1 w-4 h-4" />
                      Resume
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      class="text-destructive hover:text-destructive"
                      @click="openConfirmDialog('cancel', subscriptionForSelectedDonation.id)"
                    >
                      <Icon name="lucide:x-circle" class="mr-1 w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </template>
              </div>
            </div>
            <div v-else-if="selectedDonation.donationType === 'monthly' && !subscriptionLoading  && !subscriptionForSelectedDonation" class="space-y-2">
              <p class="text-xs font-medium tracking-wide uppercase text-muted-foreground">Monthly subscription</p>
              <p class="text-sm text-muted-foreground">
                This monthly donation has been cancelled.
              </p>
            </div>

            <!-- RECEIPT -->
            <div class="space-y-1">
              <p class="text-xs font-medium tracking-wide uppercase text-muted-foreground">Receipt</p>
              <template v-if="selectedDonation.invoiceUrl">
                <div
                  class="flex gap-3 items-center p-3 rounded-lg border"
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
            :is-loading="isProcessing"
            :variant="dialogAction === 'cancel' ? 'destructive' : 'default'"
          >
{{ getConfirmButtonText() }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, toValue } from "vue"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type Stripe from "stripe"
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
import { useToast } from "@/components/ui/toast"

export type DonationRow = {
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
  sourceTransactionId?: string
  donationType?: string
  [key: string]: unknown
}

type MonthlyDonationsResponse = {
  data?: (Stripe.Subscription & { metadata: Record<string, string> })[]
  success: boolean
}

const props = defineProps<{
  open: boolean
  selectedDonation: DonationRow | null
  monthlyDonations: MonthlyDonationsResponse | null
}>()

const emit = defineEmits<{
  "update:open": [value: boolean]
  subscriptionUpdated: []
}>()

const { toast } = useToast()
const { formatCurrency } = useMoneyFormat()
const { formatDayMonthYear } = useDateFormatter()

const openModel = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
})

function formatDate(date: unknown) {
  return formatDayMonthYear(date as MaybeRef<string | number | Date>, "MMMM D, YYYY")
}

function formatDateWithTime(date: string | Date | number | undefined | null) {
  if (date == null) return ""
  const dateTimeStr = toValue(formatDayMonthYear(date, "MMM D, YYYY [at] HH:mm"))
  const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(new Date(date as string | Date | number))
  const tzPart = parts.find((p) => p.type === "timeZoneName")
  const tzName = tzPart?.value ?? ""
  return tzName ? `${dateTimeStr} ${tzName}` : dateTimeStr
}

// Resolve subscription ID from the donation's sourceTransactionId (invoice or payment intent)
const { data: subscriptionIdFromApi, pending: subscriptionLoading } = await useAsyncData(
  () =>
    `subscription-by-transaction-${props.selectedDonation?.documentId ?? "none"}-${props.selectedDonation?.sourceTransactionId ?? "none"}`,
  async () => {
    const d = props.selectedDonation
    if (!d || d.donationType !== "monthly" || !d.sourceTransactionId)
      return null
    const res = await $fetch<{ subscriptionId: string | null }>(
      "/api/dashboard/subscription-by-transaction",
      { query: { sourceTransactionId: d.sourceTransactionId } }
    )
    return res.subscriptionId
  },
  {
    watch: [
      () => props.selectedDonation?.documentId,
      () => props.selectedDonation?.sourceTransactionId,
    ],
    lazy: true,
  }
)

// Subscription for this donation = the one in monthlyDonations that matches the transaction's subscription id
const subscriptionForSelectedDonation = computed(() => {
  const id = subscriptionIdFromApi.value
  const list = props.monthlyDonations?.data
  if (!id || !list?.length) return null
  return list.find((sub) => sub.id === id) ?? null
})

// Subscription dialog state
const dialogOpen = ref(false)
const dialogAction = ref<"pause" | "resume" | "cancel" | null>(null)
const selectedSubscriptionId = ref<string | null>(null)
const isProcessing = ref(false)

function openConfirmDialog(
  action: "pause" | "resume" | "cancel",
  subscriptionId: string
) {
  dialogAction.value = action
  selectedSubscriptionId.value = subscriptionId
  dialogOpen.value = true
}

function closeDialog() {
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
    closeDialog()
    emit("subscriptionUpdated")
  } catch (error) {
    console.error("Error managing subscription:", error)
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
