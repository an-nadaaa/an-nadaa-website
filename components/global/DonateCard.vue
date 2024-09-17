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
        <!-- <TabsContent value="monthly">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="one-time">
                Change your password here.
              </TabsContent> -->
      </Tabs>
      <p class="mt-4 text-sm">Project Supported</p>
      <Select v-model="causeSelected">
        <SelectTrigger class="mt-2">
          <SelectValue placeholder="General donation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            :value="project.id"
            v-for="(project, index) in causes"
            :key="index"
          >
            {{ project.name }}
          </SelectItem>
        </SelectContent>
      </Select>
      <div class="relative mt-2">
        <Input
          v-model="amount"
          class="w-full"
          :placeholder="'Enter amount'"
          type="number"
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
          @click="
            () => {
              if (onClick) {
                onClick()
              }
            }
          "
          class="w-full"
          >{{
            route.fullPath.includes("checkout") ? "Confirm" : "Make donation"
          }}</Button
        >
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
const causeSelected: Ref = defineModel("causeSelected")
const currencySelector: Ref = defineModel("currencySelector")
const amount: Ref = defineModel("amount")
const route = useRoute()

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
