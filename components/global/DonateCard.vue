<template>
  <Card class="pt-4">
    <CardContent>
      <h3 class="font-normal">Make your donation</h3>
      <p class="font-light text-dark-gray">
        Your donation makes a difference no matter how little
      </p>
      <Tabs default-value="monthly" class="mt-2">
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
          <SelectItem
            :value="project.id"
            v-for="(project, index) in causes"
            :key="index"
          >
            <p class="text-base">
              {{ project.name }}
            </p>
          </SelectItem>
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
            <SelectTrigger class="border-l-0 rounded-l-none">
              <SelectValue placeholder="$" />
            </SelectTrigger>
            <SelectContent class="">
              <SelectGroup class="">
                <SelectItem value="usd"> $ </SelectItem>
                <SelectItem value="myr"> RM </SelectItem>
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

        <NuxtLink v-else :to="`/checkout?${urlQueries}`">
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
// const causeSelected: Ref = defineModel("causeSelected")
// const currencySelector: Ref = defineModel("currencySelector")
// const amount: Ref = defineModel("amount")
const causeSelected = ref("general")
const currencySelector = ref("usd")
const amount = ref<any>("")
const route = useRoute()
const isCheckout = route.fullPath.includes("checkout")

const urlQueries = computed(
  () =>
    new URLSearchParams({
      currency: currencySelector.value,
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
