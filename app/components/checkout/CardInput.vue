<template>
  <div class="card-input">
    <Input
      type="text"
      v-model="formattedCardNumber"
      @input="onInput"
      placeholder="Card number"
    >
    </Input>
  </div>
  <h1 class="hidden">{{ modelValue }}</h1>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import type { HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"

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

const cardNumber = ref("")
const formattedCardNumber = ref("")

// const cardType = computed(() => {
//   const number = cardNumber.value.replace(/\s+/g, "")
//   if (/^4[0-9]{0,15}$/.test(number)) {
//     return "visa"
//   } else if (/^5[1-5][0-9]{0,14}$/.test(number)) {
//     return "mastercard"
//   } else if (/^3[47][0-9]{0,13}$/.test(number)) {
//     return "amex"
//   } else {
//     return null
//   }
// })

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, "").substring(0, 16)
  cardNumber.value = value
  formattedCardNumber.value = value.replace(/(.{4})/g, "$1 ").trim()

  handleChange()
}

function handleChange() {
  modelValue.value = cardNumber.value
}
</script>
