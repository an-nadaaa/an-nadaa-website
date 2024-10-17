<template>
  <Card class="p-4 shadow-md width-full h-fit rounded-xl">
    <h3 class="text-xl font-normal">
      <strong class="text-xl font-semibold">
        {{ formatCurrency(cause.raisedAmount) }}
      </strong>
      of {{ formatCurrency(cause.goalDetails[0].goalAmount) }} raised
    </h3>
    <Tag class="my-2" text="20 days left" :variant="'purple'" />
    <p class="font-thin text-dark-gray">
      Your donation will make a difference no matter how little
    </p>
    <Tabs v-model="toggleIndex" default-value="monthly">
      <TabsList class="w-full">
        <TabsTrigger value="monthly" class="w-full"> Monthly </TabsTrigger>
        <TabsTrigger value="one-time" class="w-full"> One-time </TabsTrigger>
      </TabsList>
    </Tabs>
    <div class="relative mt-4">
      <Input
        v-model="amount"
        class="w-full"
        :placeholder="'Enter amount'"
        type="number"
      ></Input>
      <div class="absolute top-0 right-0">
        <Select v-model="currencySelector" class="">
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
      <NuxtLink :to="'/checkout?' + urlParams.toString()" class="w-full">
        <Button class="w-full">Make donation</Button>
      </NuxtLink>
      <Button
        @click="() => scrollToElement()"
        variant="white"
        class="w-full mt-2"
        >Donate to An-Nadaa bank account</Button
      >
    </div>

    <p
      class="flex items-center justify-center mt-4 font-light hover:cursor-pointer hover:underline"
    >
      <Icon name="lucide:share-2" class="mr-2"></Icon> Share with family and
      friends
    </p>
  </Card>
</template>

<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Input from "../ui/input/Input.vue"

const { currencies, defaultCurrency } = useAppConfig()

const route = useRoute()
const urlParams = computed(() => {
  return new URLSearchParams({
    causeId: route.params.id as string,
    amount: amount.value,
    currency: currencySelector.value,
    frequency: toggleIndex.value,
  })
})
const { formatCurrency } = useMoneyFormat()
const amount = ref()
const currencySelector = ref((defaultCurrency as any).code)
defineProps(["cause", "scrollToElement"])
const toggleIndex: Ref = defineModel("toggleIndex")

onBeforeMount(() => {
  toggleIndex.value = "monthly"
})
</script>
