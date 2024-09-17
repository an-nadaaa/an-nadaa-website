<template>
  <div class="relative py-12 bg-dark-blue">
    <img
      class="absolute top-0 right-0 z-0 hidden h-60 sm:block"
      src="assets/media/img/Line.svg"
    />
    <div class="container grid gap-y-8 sm:grid-cols-2">
      <div class="text-white sm:pr-8">
        <h1 class="sm:mt-24">Donate</h1>
        <p class="max-w-md mt-4 font-light">
          Bring change to the lives of millions by supporting educational and
          welfare projects of An-Nadaa that are bringing a huge positive impact
          to the community.
        </p>
      </div>
      <DonateCard
        class="z-10"
        :scroll-to-element="scrollToElement"
        :causes="causes"
        v-model:cause-selected="causeSelected"
        v-model:currency-selector="currencySelector"
      />
    </div>
  </div>

  <div class="container py-12" ref="bankInfo">
    <h2 class="font-normal">Direct transfers (Other ways to donate)</h2>
    <p class="max-w-3xl mt-4 font-light text-dark-gray">
      When doing a direct transfer we need our donors to send us an email
      detailing the purpose of the donation and a proof of transfer especially
      if it's for Zakat purpose. Contact information can be found here
    </p>
    <BankDetails class="mt-8" />
  </div>

  <h1>{{ causeSelected }}</h1>

  <HomeFAQSection />
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import BankDetails from "~/components/global/BankDetails.vue"
import type { ModelRef } from "vue"
import DonateCard from "~/components/global/DonateCard.vue"

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
const causeSelected = ref("general")
const currencySelector = ref("usd")
const bankInfo = ref()

function scrollToElement() {
  bankInfo.value?.scrollIntoView({ behavior: "smooth" })
}
</script>
