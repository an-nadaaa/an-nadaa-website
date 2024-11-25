<template>
  <div>
    <div
      :class="`px-3 py-[10px] h-[40px] border border-gray-200 text-primary font-thin rounded-md outline-none animate-none ${
        isStripeLoaded ? 'bg-white' : 'bg-slate-300 animate-pulse'
      }`"
      ref="cardElement"
      id="card-element"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useStripe } from "~/composables/useStripe"

const errorMessage = defineModel("errorMessage", {
  type: String,
  default: "",
  required: false,
})
const card = defineModel("card", {
  type: Object,
  required: true,
})

const stripe = ref(null)
const isStripeLoaded = ref(false)
const elements = ref(null)
const cardElement = ref(null)

onMounted(async () => {
  stripe.value = await useStripe()
  elements.value = stripe.value.elements({
    fonts: [
      {
        // integrate your font into stripe
        family: "Satoshi",
        src: "url('/assets/fonts/Satoshi/Satoshi-Light.otf')",
      },
    ],
  })
  card.value = elements.value.create("card", {
    style: {
      base: {
        // color: "#32325d",
        fontFamily: "Satoshi, sans-serif", // set integrated font family
        fontSmoothing: "antialiased",
        fontSize: "14px",
        "::placeholder": {
          fontWeight: "400",
          color: "#64758b",
        },
      },
    },
  })
})

watch(card, (instance) => {
  instance.mount("#card-element")

  isStripeLoaded.value = true

  instance.on("change", (event) => {
    errorMessage.value = event.error ? event.error.message : ""
  })
})
</script>
