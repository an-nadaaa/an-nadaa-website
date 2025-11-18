<template>
  <Card class="pt-4 outline-none">
    <CardContent>
      <h3 class="font-normal">Donation details</h3>
      <p class="font-light text-dark-gray">
        Your donation make a difference no matter how little
      </p>
      <Tabs v-model="donationFrequency" default-value="one-time" class="mt-4">
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
            <SelectTrigger class="rounded-l-none border-l-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent class="">
              <SelectGroup class="">
                <SelectItem
                  v-for="(currency, index) in Object.values(
                    currencies as Record<string, any>
                  )"
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
          variant="outline"
          class="mt-2 w-full font-light"
          >Donate to An-Nadaa bank account</Button
        >
      </div>
    </CardContent>
  </Card>

  <!-- Login Required Dialog for Monthly Donations -->
  <Dialog v-model:open="loginDialogOpen">
    <DialogContent class="sm:max-w-[425px] max-w-11/12 rounded-lg">
      <DialogHeader>
        <DialogTitle>Login Required</DialogTitle>
        <DialogDescription>
          You must be logged in to set up monthly donations. Please sign up if
          you don't have an account, or log in to continue.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2 rounded-b-lg">
        <DialogClose as-child>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button as-child>
          <NuxtLink to="/login">Log In</NuxtLink>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const { currencies } = useAppConfig()
const { loggedIn } = useUserSession()
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

const route = useRoute()
const isCheckout = route.fullPath.includes("checkout")
const loginDialogOpen = ref(false)
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

watch(donationFrequency, (newValue) => {
  if (newValue === "monthly" && !loggedIn.value) {
    loginDialogOpen.value = true
    // Reset toggle back to one-time since they can't proceed with monthly
    donationFrequency.value = "one-time"
  }
})
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
