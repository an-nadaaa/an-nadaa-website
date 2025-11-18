<template>
  <div class="flex">
    <Popover :open="toValue(popoverOpen)">
      <PopoverTrigger>
        <div
          @click="() => handlePopoverTrigger()"
          class="flex items-center h-full px-2 text-sm border border-r-0 border-gray-200 rounded-md rounded-r-none"
        >
          {{ selectedCode }}
          <ChevronDown class="w-4 text-dark-gray"></ChevronDown>
        </div>
      </PopoverTrigger>
      <PopoverContent
        ><Command ref="popover">
          <CommandInput placeholder="Search country or code" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandItem
              v-for="(country, index) in phoneCodes"
              :key="index"
              :value="`${country.name}_${country.code}_${country.dial_code}`"
              class="flex justify-between"
              @click="() => handleCommandClick(country)"
            >
              {{ country.name }}
              <p class="text-sm font-light text-dark-gray">
                {{ country.dial_code }}
              </p>
            </CommandItem>
            <!-- <CommandItem value="search-emoji"> Search Emoji </CommandItem>
            <CommandItem value="calculator"> Calculator </CommandItem> -->
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    <Input
      v-model="numberInput"
      class="border-l-0 rounded-l-none remove-arrow"
      :placeholder="placeholder || 'Enter your phone number'"
      type="number"
      @input="handleInput"
    />
  </div>
  <h1 class="hidden">{{ modelValue }}</h1>
</template>

<script setup lang="ts">
import { phoneCodes } from "./CountryCodes.json"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown } from "lucide-vue-next"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { onClickOutside } from "@vueuse/core"
import { useVModel } from "@vueuse/core"
import type { HTMLAttributes } from "vue"

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes["class"]
  placeholder?: string
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const numberInput = ref<any>()
const numberString = ref<string>()
const selectedCode = ref("+60")
const popoverOpen = ref(false)
const popover = ref()

onClickOutside(popover as any, (event) => {
  if (popoverOpen.value) {
    popoverOpen.value = false
  }
})

function handleCommandClick(country: {
  name: string
  code: string
  dial_code: string
}) {
  selectedCode.value = country.dial_code
  popoverOpen.value = false
}

function handlePopoverTrigger() {
  popoverOpen.value = !popoverOpen.value
}

function handleChange() {
  modelValue.value =
    selectedCode.value.toString() + numberString.value?.toString()
}

function handleInput(event: any) {
  // Get the value, allow only numbers, and convert it to a string
  const inputValue = event.target.value.replace(/\D/g, "") // Remove non-digit characters
  numberInput.value = inputValue.toString()
}

watch(numberInput, (value) => {
  numberString.value = value?.toString()
  handleChange()
})

watch(selectedCode, (value) => {
  console.log(value)
  handleChange()
})
</script>

<style>
.remove-arrow::-webkit-inner-spin-button,
.remove-arrow::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.remove-arrow {
  -moz-appearance: textfield;
}
</style>
