<template>
  <Card class="pt-4">
    <CardContent>
      <h3 class="font-normal">Donation details</h3>
      <p class="font-light text-dark-gray">
        Your donation make a difference no matter how little
      </p>
      <Tabs v-model="donationFrequency" default-value="monthly" class="mt-2">
        <TabsList class="w-full">
          <TabsTrigger value="monthly" class="w-full"> Monthly </TabsTrigger>
          <TabsTrigger value="one-time" class="w-full"> One-time </TabsTrigger>
        </TabsList>
      </Tabs>
      <p class="mt-4 text-sm">Project Supported</p>
      <Select class="" v-model="causeSelected">
        <SelectTrigger class="mt-2">
          <SelectValue placeholder="General donation" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="general"> General donation </SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel
              v-if="causes.length > 0"
              class="pl-2 my-1 mt-0 text-base font-medium"
              >Causes</SelectLabel
            >
            <SelectItem
              :value="project.id"
              v-for="(project, index) in causes"
              :key="index"
            >
              <p class="text-base">
                {{ project.name }}
              </p>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div class="relative mt-2">
        <Input
          @input="validateAmount"
          v-model="amount"
          class="w-full text-base"
          :placeholder="'Enter amount'"
        ></Input>
        <div class="absolute top-0 right-0">
          <Select v-model="currencySelected" class="">
            <SelectTrigger class="border-l-0 rounded-l-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent class="">
              <SelectGroup class="">
                <SelectItem
                  v-for="(currency, index) in Object.values(currencies as Record<string,any>)"
                  :key="index"
                  :value="currency.code"
                >
                  {{ currency.symbol }}</SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div class="mt-4">
        <Button
          :class="{ disabled }"
          v-if="isCheckout"
          @click="
            () => {
              if (onClick) {
                onClick()
              }
            }
          "
          class="w-full"
          >Confirm</Button
        >

        <NuxtLink v-else :class="{ disabled }" :to="`/checkout?${urlQueries}`">
          <Button class="w-full">Make donation</Button>
        </NuxtLink>
        <Button
          v-if="!!scrollToElement"
          @click="
            () => {
              if (scrollToElement) {
                scrollToElement()
              }
            }
          "
          variant="white"
          class="w-full mt-2"
          >Donate to An-Nadaa bank account</Button
        >
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const { currencies } = useAppConfig()

const disabled = computed(() => !amount.value || parseFloat(amount.value) <= 0)
const causeSelected = defineModel("causeSelected", {
  type: String,
  default: "general",
})
const currencySelected = defineModel("currencySelected", {
  type: String,
  required: true,
})
const amount = defineModel("amount", {
  type: String,
  required: true,
})
const donationFrequency = defineModel("donationFrequency", {
  type: String,
  required: true,
})

// const amount = ref<any>("")
const route = useRoute()
const isCheckout = route.fullPath.includes("checkout")

const urlQueries = computed(
  () =>
    new URLSearchParams({
      currency: currencySelected.value,
      amount: (amount.value || 0).toString(),
      id: causeSelected.value,
    })
)

function validateAmount() {
  if (amount.value !== "") {
    const value = amount.value.toString()
    const regex = /^\d*\.?\d{0,2}$/
    if (!regex.test(value)) {
      amount.value = value.slice(0, -1)
    }
  }
}

defineProps({
  causes: {
    type: Array<any>,
    required: true,
  },
  scrollToElement: {
    type: Function,
    required: false,
  },
  onClick: {
    type: Function,
    required: false,
  },
})
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.7;
}
</style>
