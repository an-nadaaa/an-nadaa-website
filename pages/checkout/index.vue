<template>
  <div class="container grid py-4 sm:py-20 gap-x-8 gap-y-8 sm:grid-cols-2">
    <div class="order-2 sm:order-1">
      <CheckoutPaymentForm class="shadow-lg" />
    </div>
    <div class="order-1 sm:order-2">
      <DonateCard
        v-if="isEditing"
        class="shadow-lg outline-1"
        :causes="causes"
        :on-click="onConfirm"
        v-model:currency-selector="currencySelector"
        v-model:cause-selected="causeSelected"
        v-model:amount="amount"
      />
      <Card v-else class="pt-4">
        <CardContent class="relative">
          <Button
            @click="isEditing = true"
            class="absolute top-0 right-0 mr-4"
            variant="white"
          >
            <Icon name="lucide:pen" class="mr-2" />
            Edit</Button
          >
          <h3 class="text-lg font-medium">Your donation</h3>
          <img :src="logo" class="w-32 my-4" />

          <h4 class="text-base font-medium">Donation</h4>
          <p class="text-sm font-light text-dark-gray">
            {{
              causeSelected === "general" ? "General Donation" : causeSelected
            }}
          </p>

          <h4 class="mt-6 text-3xl font-normal">
            {{ amount }} {{ currencySelector.toUpperCase() }}
            {{ isMonthly ? "/month" : "" }}
          </h4>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import DonateCard from "~/components/global/DonateCard.vue"

const appConfig = useAppConfig()
const logo = appConfig.logo.white
const route = useRoute()
const currencySelector = ref("usd")
const causeSelected = ref("general")
const amount = ref(123)
const isMonthly = ref(true)
const isEditing = ref(false)

const causes = ref([
  {
    name: "General donation",
    id: "general",
    description: "Support the general fund of An-Nadaa",
  },
  {
    name: "Project Education",
    id: "education",
    description: "Support the education fund of An-Nadaa",
  },
])

function onConfirm() {
  isEditing.value = false
}

onBeforeMount(() => {
  currencySelector.value = (route.query.currency as string) || "usd"
  causeSelected.value = (route.query.causeId as string) || "general"
  amount.value = Number(route.query.amount) || 123
  isMonthly.value = route.query.frequency === "monthly"
})
</script>
