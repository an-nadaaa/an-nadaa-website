<template>
  <div class="p-4 shadow-md width-full h-fit rounded-xl">
    <h3 class="text-xl font-normal">
      <strong class="text-xl font-semibold">
        ${{ formatCurrency(cause.raisedAmount) }}
      </strong>
      of ${{ formatCurrency(cause.goalAmount) }} raised
    </h3>
    <Tag class="my-2" text="20 days left" :variant="'purple'" />
    <p class="font-thin text-dark-gray">
      Your donation will make a difference no matter how little
    </p>
    <Toggle
      class="mt-2 mb-4"
      :states="['Monthly', 'One-time']"
      v-model="toggleIndex"
    />
    <div class="relative">
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
  </div>
</template>

<script setup lang="ts">
import Input from "../ui/input/Input.vue";

const { formatCurrency } = useMoneyFormat();

const currencySelector = ref("usd");
defineProps(["cause", "scrollToElement"]);
const toggleIndex = defineModel();
</script>
