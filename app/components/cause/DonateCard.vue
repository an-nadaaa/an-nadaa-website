<!-- todo: add design for the project type of cause -->

<template>
  <Card
    :class="{
      'p-4 overflow-x-hidden shadow-md width-full h-fit rounded-xl':
        cause.isActive,
      'opacity-50 pointer-events-none p-4': !cause.isActive,
    }"
  >
    <h3 class="text-xl font-normal">
      <strong class="text-xl font-semibold">
        {{ formatCurrency(cause.raisedAmount) }}
      </strong>
      <template v-if="cause.goalDetails[0].goalAmount">
        of {{ formatCurrency(cause.goalDetails[0].goalAmount) }} raised
      </template>
      <template v-else> raised </template>
    </h3>
    <div class="flex">
      <Tag
        v-for="(tag, index) in cause.tags"
        :key="index"
        class="my-2 mr-1"
        :text="tag.value"
        :variant="tag.color"
      />
    </div>
    <p class="font-thin text-dark-gray">
      Your donation will make a difference no matter how little
    </p>
    <Tabs class="mt-4" v-model="toggleIndex" default-value="one-time">
      <TabsList class="w-full">
        <!-- todo: remove the coming soon block -->
        <TabsTrigger value="monthly" class="relative w-full">
          Monthly
        </TabsTrigger>
        <TabsTrigger value="one-time" class="w-full"> One-time </TabsTrigger>
      </TabsList>
    </Tabs>
    <div class="relative mt-4">
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
      <NuxtLink
        :class="{ disabled }"
        :to="'/checkout?' + urlQueries.toString()"
        class="w-full"
      >
        <Button class="w-full">Make donation</Button>
      </NuxtLink>
      <Button
        @click="() => scrollToElement()"
        variant="outline"
        class="mt-2 w-full font-light"
        >Donate to An-Nadaa bank account</Button
      >
    </div>

    <p
      @click="share"
      class="flex justify-center items-center mt-4 font-light hover:cursor-pointer hover:underline"
    >
      <Icon name="lucide:share-2" class="mr-2"></Icon> Share with family and
      friends
    </p>
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Input from "../ui/input/Input.vue"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const { loggedIn } = useUserSession()
const { currencies, defaultCurrency } = useAppConfig()
const route = useRoute()
const { formatCurrency } = useMoneyFormat()
const amount = ref()
const currencySelector = ref((defaultCurrency as any).code)
const props = defineProps(["cause", "scrollToElement"])
const toggleIndex = ref<"one-time" | "monthly">("one-time")
const url = ref("")
const loginDialogOpen = ref(false)

const disabled = computed(() => !amount.value || amount.value <= 0)
const urlQueries = computed(
  () =>
    new URLSearchParams({
      currency: currencySelector.value,
      amount: (amount.value || 0).toString(),
      id: route.params.id as string,
      frequency: toggleIndex.value,
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

function share() {
  if (navigator.share) {
    navigator
      .share({
        title: `Donate to An-Nadaa | ${props.cause.title}`,
        text: `Support ${props.cause.title} by donating to An-Nadaa`,
        url: url.value,
      })
      .then(() => console.log("Content shared successfully!"))
      .catch((error) => console.error("Error sharing", error))
  } else {
    console.log("Web Share API is not supported in this browser.")
  }
}

onMounted(() => {
  url.value = window.location.href
})

// Watch for toggle changes - if user switches to monthly and is not logged in, show dialog
watch(toggleIndex, (newValue) => {
  if (newValue === "monthly" && !loggedIn.value) {
    loginDialogOpen.value = true
    // Reset toggle back to one-time since they can't proceed with monthly
    toggleIndex.value = "one-time"
  }
})
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.7;
}
</style>
