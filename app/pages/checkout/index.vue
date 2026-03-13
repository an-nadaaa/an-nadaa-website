<template>
  <div class="container grid gap-y-2 gap-x-4 py-4 sm:py-10 sm:grid-cols-2">
    <div class="sm:col-span-2">
      <NuxtLink class="w-fit" @click="() => router.back()">
        <div class="relative mb-2 w-fit hover:underline">
          <Icon
            :name="'lucide:arrow-left'"
            class="absolute left-0 mr-1 top-[5px]"
          />
          <p class="ml-6 text-lg">Go back</p>
        </div>
      </NuxtLink>
    </div>
    <div class="relative order-2 sm:order-1">
      <CheckoutPaymentForm
        class="shadow-lg"
        v-model:donation-details="donationDetails"
        v-model:loading="loading"
      />
      <transition name="blur">
        <div
          v-if="isEditing"
          class="flex absolute inset-0 z-10 justify-center items-center bg-opacity-50 backdrop-blur-xs"
        ></div>
      </transition>
    </div>
    <div class="order-1 sm:order-2">
      <DonateCard
        v-if="isEditing || !donateAmount"
        class="outline-1"
        :causes="causes"
        :on-click="onConfirm"
        v-model:currency-selected="currencySelected"
        v-model:cause-selected="causeSelected"
        v-model:amount="donateAmount"
        v-model:donation-frequency="donationFrequency"
      />
      <Card v-else class="pt-4">
        <CardContent class="relative">
          <Button
            @click="isEditing = true"
            class="absolute top-0 right-0 mr-4"
            variant="outline"
          >
            <Icon name="lucide:pen" class="mr-2" />
            Edit</Button
          >
          <h3 class="font-normal">Your donation</h3>
          <img :src="logo" class="my-4 w-32" />

          <h4 class="font-medium">Donation</h4>
          <p class="font-light text-dark-gray">
            {{
              causeSelected === "general"
                ? "General Donation"
                : causes.find((cause: any) => {
                    return causeSelected === cause.id
                  })?.name || "ERROR FINDING CAUSE"
            }}
          </p>

          <h4 class="mt-6 text-3xl font-normal">
            {{ donateAmount }} {{ currencySelected.toUpperCase()
            }}{{ isMonthly ? "/month" : "" }}
          </h4>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import DonateCard from "@/components/checkout/DonateCard.vue"

const strapiFetch = useStrapiFetch()
const appConfig = useAppConfig()
const logo = (appConfig.logo as any).color
const route = useRoute()
const router = useRouter()
const { loggedIn } = useUserSession()

const { currency, id, amount, frequency } = route.query
const currencySelected = ref("USD")
const causeSelected = ref("general")
const donateAmount = ref<any>(Number(amount) || "")
const donationFrequency = ref(
  loggedIn.value ? (frequency as string) || "one-time" : "one-time"
)
const isEditing = ref(false)
const causes = ref<any[]>([])
const loading = ref(false)

const isMonthly = computed(() => donationFrequency.value === "monthly")
const donationDetails = computed(() => {
  return {
    causeSelected: causeSelected.value,
    donateAmount: parseFloat(donateAmount.value),
    currencySelected: currencySelected.value,
    donationFrequency: donationFrequency.value,
  }
})

function onConfirm() {
  isEditing.value = false
}

const pageSize = 100
const allCauses: any[] = []
let page = 1
let pageCount = 1

do {
  const res = await strapiFetch(
    "/causes",
    "GET",
    {},
    {
      filters: {
        isActive: true,
        environment: process.env.NODE_ENV,
      },
      pagination: { page, pageSize },
      sort: ["title:asc"],
    }
  )
  const value = (res as any).data?.value ?? (res as any).data
  const data = value?.data ?? []
  const meta = value?.meta ?? {}
  allCauses.push(...data)
  pageCount = meta?.pagination?.pageCount ?? 1
  page += 1
} while (page <= pageCount)

const strapiCauses = allCauses.map((cause: any) => ({
  name: cause.title,
  id: cause.documentId,
  isPrivate: cause.isPrivate,
}))
causes.value = [...strapiCauses].filter((cause) => {
  if (cause.id !== id) return cause.isPrivate === false
  return true
})

if (id && id !== "general") {
  if (!(strapiCauses as any[]).find((cause: any) => id === cause.id)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Cause not found",
      fatal: true,
    })
  }
}

onBeforeMount(async () => {
  currencySelected.value = (currency as string) || "USD"
  causeSelected.value = (id as string) || "general"
  donateAmount.value = Number(amount) || null
})
</script>

<style scoped>
.blur-enter-active,
.blur-leave-active {
  transition: opacity 0.5s;
}
.blur-enter, .blur-leave-to /* .blur-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
