<template>
  <Card class="pt-4">
    <CardContent>
      <h3 class="font-normal">Make your donation</h3>
      <p class="font-light text-dark-gray">
        Your donation makes a difference no matter how little
      </p>
      <Tabs v-model="frequencySelector" default-value="one-time" class="mt-4">
        <TabsList class="w-full">
          <TabsTrigger
            value="monthly"
            class="relative w-full pointer-events-none"
          >
            Monthly
            <p
              class="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-[15px] p-[2px] text-xs text-white border border-gray-200 rounded-sm bg-slate-300"
            >
              Coming soon
            </p>
          </TabsTrigger>
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
          <Select v-model="currencySelector" class="">
            <SelectTrigger class="rounded-l-none border-l-0">
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
          variant="outline"
          class="mt-2 w-full font-light"
          >Donate to An-Nadaa bank account</Button
        >
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const props = defineProps({
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

const { currencies, defaultCurrency } = useAppConfig()

const disabled = computed(() => !amount.value || amount.value <= 0)
const currencySelector = ref((defaultCurrency as any).code)
const frequencySelector = ref("one-time")
const amount = ref<any>("")
const route = useRoute()
const isCheckout = route.fullPath.includes("checkout")
const isDonatePage = route.path === "/donate"
const causeSelected = ref("general")
if (isDonatePage) {
  if (
    route.query.id &&
    props.causes.map((cause) => cause.id).includes(route.query.id as string)
  ) {
    causeSelected.value = route.query.id as string
  }
  if (route.query.amount) {
    amount.value = route.query.amount as string
  }
  if (
    route.query.currency &&
    Object.keys(currencies as any).includes(route.query.currency as string)
  ) {
    currencySelector.value = route.query.currency as string
  }
}

const urlQueries = computed(
  () =>
    new URLSearchParams({
      currency: currencySelector.value,
      amount: (amount.value || 0).toString(),
      id: causeSelected.value,
      frequency: frequencySelector.value,
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
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.7;
}
</style>
