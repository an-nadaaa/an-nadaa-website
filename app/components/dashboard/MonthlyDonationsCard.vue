<template>
  <Card class="shadow-none lg:col-span-2">
    <CardHeader>
      <div class="flex justify-between items-center">
        <CardTitle class="text-base font-medium"
          >Your Monthly Donations</CardTitle
        >
      </div>
    </CardHeader>
    <CardContent
      v-if="!loadingMonthlyDonations && monthlyDonations?.data?.length === 0"
    >
      <div class="flex flex-col justify-center items-center py-8 space-y-4">
        <!-- Empty State Illustration -->
        <img src="/img/designing-a-website.png" class="w-32 h-32" />
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
    <CardContent
      class="max-h-[500px] overflow-y-auto"
      v-else-if="
        !loadingMonthlyDonations &&
        monthlyDonations?.data?.length &&
        monthlyDonations?.data?.length > 0
      "
    >
      <div class="grid grid-cols-1">
        <div
          v-for="monthlyDonation in monthlyDonations?.data?.slice(0, limit)"
          :key="monthlyDonation.id"
          class="flex overflow-hidden gap-2 justify-between items-center py-5 border-b border-gray-200"
        >
          <DropdownMenu v-if="!hideDropdownMenu">
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon" class="w-8 h-8">
                <Icon name="lucide:more-vertical" class="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-fit">
              <DropdownMenuItem
                v-if="
                  monthlyDonation.status === 'active' &&
                  !monthlyDonation.pause_collection
                "
                @click="openConfirmDialog('pause', monthlyDonation.id)"
              >
                <Icon name="lucide:pause" class="mr-2 w-4 h-4" />
                Pause
              </DropdownMenuItem>
              <DropdownMenuItem
                v-else-if="
                  monthlyDonation.status === 'active' &&
                  monthlyDonation.pause_collection
                "
                @click="openConfirmDialog('resume', monthlyDonation.id)"
              >
                <Icon name="lucide:play" class="mr-2 w-4 h-4" />
                Resume
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="openConfirmDialog('cancel', monthlyDonation.id)"
                class="text-destructive focus:text-destructive"
              >
                <Icon name="lucide:x-circle" class="mr-2 w-4 h-4" />
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            class="flex flex-col grow"
            :class="{
              'opacity-50':
                monthlyDonation.status === 'active' &&
                monthlyDonation.pause_collection,
            }"
          >
            <h3 class="text-base font-normal truncate" style="max-width: 100%">
              {{ monthlyDonation.metadata.causeTitle }}
            </h3>
            <p
              v-if="
                monthlyDonation.status === 'active' &&
                !monthlyDonation.pause_collection
              "
              class="text-xs font-light text-gray-400"
            >
              Next payment on
              {{ formatDate(monthlyDonation.current_period_end * 1000) }}
            </p>
            <p v-else class="text-xs font-light text-gray-400">Paused</p>
          </div>
          <div class="flex flex-col items-end">
            <p
              class="text-sm font-medium"
              :class="{
                'text-gray-500':
                  monthlyDonation.status === 'active' &&
                  monthlyDonation.pause_collection,
                'text-green-500':
                  monthlyDonation.status === 'active' &&
                  !monthlyDonation.pause_collection,
              }"
            >
              {{
                formatCurrency(
                  ((monthlyDonation.items.data[0] as Stripe.SubscriptionItem)
                    .plan.amount as number) / 100,
                  (
                    monthlyDonation.items.data[0] as Stripe.SubscriptionItem
                  ).plan.currency?.toUpperCase()
                )
              }}
              /month
            </p>
          </div>
        </div>
        <NuxtLink
          v-if="!hideShowAllLink"
          :to="$localePath('/dashboard/donations')"
        >
          <p
            class="font-medium text-sm mt-4 text-right text-[#166588] hover:underline cursor-pointer"
          >
            Show all monthly donations
          </p>
        </NuxtLink>
      </div>
    </CardContent>
    <CardContent v-else>
      <div class="grid grid-cols-1">
        <div
          v-for="i in 4"
          :key="i"
          class="flex overflow-hidden gap-2 justify-between items-center py-5 border-b border-gray-200"
        >
          <div class="flex flex-col space-y-2 grow">
            <Skeleton class="w-3/4 h-4"></Skeleton>
            <Skeleton class="w-1/2 h-3"></Skeleton>
          </div>
          <div class="flex flex-col items-end space-y-2">
            <Skeleton class="w-20 h-4"></Skeleton>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

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
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
import type { StripeTransactionMetadata } from "@@/server/api/process-donation.post"
import type Stripe from "stripe"
import { useToast } from "@/components/ui/toast"

interface Props {
  hideDropdownMenu?: boolean
  hideShowAllLink?: boolean
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  hideDropdownMenu: false,
  hideShowAllLink: false,
  limit: undefined,
})

const { toast } = useToast()
const { formatCurrency } = useMoneyFormat()
const { formateDayMonthYear } = useDateFormatter()

// Fetch monthly donations
const {
  data: monthlyDonations,
  pending: loadingMonthlyDonations,
  refresh: refreshMonthlyDonations,
} = await useAsyncData(
  "monthly-subscriptions-card",
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

function formatDate(date: any) {
  return formateDayMonthYear(date, "MMMM D, YYYY")
}
</script>
