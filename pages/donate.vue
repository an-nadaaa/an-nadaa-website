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
      <div class="z-10 p-8 px-4 bg-white rounded-xl sm:px-8">
        <h3 class="font-normal">Make your donation</h3>
        <p class="font-light text-dark-gray">
          Your donation makes a difference no matter how little
        </p>
        <Tabs default-value="monthly" class="mt-2">
          <TabsList class="w-full">
            <TabsTrigger value="monthly" class="w-full"> Monthly </TabsTrigger>
            <TabsTrigger value="one-time" class="w-full">
              One-time
            </TabsTrigger>
          </TabsList>
          <!-- <TabsContent value="monthly">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="one-time">
            Change your password here.
          </TabsContent> -->
        </Tabs>
        <p class="mt-4 text-sm">Project Supported</p>
        <Select v-model="value">
          <SelectTrigger class="mt-2">
            <SelectValue placeholder="General donation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              :value="project.id"
              v-for="(project, index) in projects"
              :key="index"
            >
              {{ project.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <div class="relative mt-2">
          <Input class="w-full" :placeholder="'Enter amount'"></Input>
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
          <Button class="w-full">Make donation</Button>
          <Button @click="scrollToElement" variant="white" class="w-full mt-2"
            >Donate to An-Nadaa bank account</Button
          >
        </div>
      </div>
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
const value = ref("general")
const currencySelector = ref("usd")
const bankInfo = ref()

function scrollToElement() {
  bankInfo.value?.scrollIntoView({ behavior: "smooth" })
}
</script>
