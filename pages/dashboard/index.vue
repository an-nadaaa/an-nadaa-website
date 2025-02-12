<template>
  <div class="flex justify-between">
    <div class="">
      <h1 class="text-3xl font-medium">As-salamu alaykum,</h1>
      <p class="text-gray-400">See all donations you have made so far</p>
    </div>
    <div class="flex space-x-3">
      <Button variant="white"
        ><Icon name="lucide:cloud-download" class="mr-2" />Export
        Donations</Button
      >
      <Button>Donate</Button>
    </div>
  </div>
  <div class="flex justify-between mt-4">
    <Tabs v-model="timeframe" default-value="30days" class="w-[400px]">
      <TabsList>
        <TabsTrigger value="12months"> 12 months </TabsTrigger>
        <TabsTrigger value="30days"> 30 days </TabsTrigger>
        <TabsTrigger value="7days"> 7 days </TabsTrigger>
        <TabsTrigger value="1day"> 1 day </TabsTrigger>
      </TabsList>
    </Tabs>
    <Button variant="white"
      ><Icon name="lucide:calendar" class="mr-2"></Icon>Select dates</Button
    >
  </div>
</template>
<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

definePageMeta({
  layout: "dashboard",
})

const { fetchUser } = useStrapiAuth()
const timeframe = ref("30days")

const user = await fetchUser()
</script>
