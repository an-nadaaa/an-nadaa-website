<template>
  <div class="flex">
    <Popover :open="popoverOpen">
      <PopoverTrigger>
        <div
          @click="popoverOpen = !popoverOpen"
          class="flex items-center h-full px-2 border border-r-0 border-gray-200 rounded-md rounded-r-none"
        >
          {{ selectedCode }}
          <ChevronDown class="w-4 text-dark-gray"></ChevronDown>
        </div>
      </PopoverTrigger>
      <PopoverContent
        ><Command>
          <CommandInput placeholder="Search country or code" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandItem
              v-for="(country, index) in phoneCodes"
              :key="index"
              :value="country.code"
              class="flex justify-between"
              @click="
                () => {
                  selectedCode = country.code
                  popoverOpen = false
                }
              "
            >
              {{ country.name }}
              <p class="text-sm font-light text-dark-gray">
                {{ country.code }}
              </p>
            </CommandItem>
            <!-- <CommandItem value="search-emoji"> Search Emoji </CommandItem>
            <CommandItem value="calculator"> Calculator </CommandItem> -->
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    <Input class="border-l-0 rounded-l-none" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">
import { phoneCodes } from "./phonecodes.json"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown } from "lucide-vue-next"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

defineProps({
  placeholder: {
    type: String,
    required: false,
    default: "Enter your phone number",
  },
})

const selectedCode = ref("+60")
const popoverOpen = ref(false)
</script>
