<template>
  <div class="container grid py-20 gap-x-8 gap-y-8 sm:grid-cols-2">
    <div class="order-2 sm:order-1">
      <CheckoutPaymentForm class="shadow-lg" />
    </div>
    <div class="order-1 sm:order-2">
      <DonateCard
        v-if="isEditing"
        class="shadow-lg outline-1"
        :projects="projects"
        v-model:currency-selector="currencySelector"
        v-model:project-selected="projectSelected"
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
          <img
            src="~/assets/media/img/logos/annadaa-color.svg"
            class="w-32 my-4"
          />

          <h4 class="text-base font-medium">Donation</h4>
          <p class="text-sm font-light text-dark-gray">
            {{
              projectSelected === "general"
                ? "General Donation"
                : projectSelected
            }}
          </p>

          <h4 class="mt-6 text-3xl font-normal">
            {{ amount }} {{ currencySelector.toUpperCase() }}
            {{ isMonthly && "/month" }}
          </h4>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import DonateCard from "~/components/global/DonateCard.vue"

const currencySelector = ref("usd")
const projectSelected = ref("general")
const amount = ref("123")
const isMonthly = ref(true)
const isEditing = ref(false)

const projects = ref([
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
</script>
