<template>
  <div class="container my-16 hidden sm:block">
    <h1 class="text-2xl font-medium text-center">Frequently Asked Questions</h1>
    <p class="text-dark-gray text-sm font-light text-center mt-4">
      Everything you need to know about donating with An-Nadaa
    </p>
    <div class="mt-8 grid gap-4 gap-y-20 grid-cols-2 lg:grid-cols-3">
      <div v-for="faq in faqs" :key="faq.question" class="">
        <h2 class="text-base font-medium text-foreground">
          {{ faq.question }}
        </h2>
        <p class="text-sm font-light text-dark-gray mt-2">{{ faq.answer }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
type FAQ = {
  question: string
  answer: string
}
const faqs = ref<FAQ[]>([])

faqs.value = [
  {
    question: "How can I donate to An-Nadaa?",
    answer:
      "You can donate to An-Nadaa by visiting our website and clicking on the 'Donate' button. You will be redirected to a secure payment gateway where you can choose the amount you wish to donate and complete the donation process.",
  },
  {
    question: "What types of donations does An-Nadaa accept?",
    answer:
      "An-Nadaa accepts monetary donations as well as donations in the form of goods such as food, clothing, and household items. We also accept donations of time through volunteering opportunities.",
  },
  {
    question: "How can I get involved with An-Nadaa?",
    answer:
      "There are several ways to get involved with An-Nadaa. You can donate money or goods, volunteer your time, or spread the word about our organization through social media and other channels. Visit our website to learn more about how you can contribute.",
  },
  {
    question: "Can I donate anonymously?",
    answer:
      "Yes, you can choose to donate anonymously. When making a donation, you will have the option to provide your name or donate anonymously. We respect your privacy and will not disclose your personal information without your consent.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer:
      "Yes, An-Nadaa is a registered non-profit organization and donations made to us are tax-deductible. Upon making a donation, you will receive a receipt that can be used for tax purposes. Please consult with a tax professional for specific advice regarding your situation.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer:
      "Yes, An-Nadaa is a registered non-profit organization and donations made to us are tax-deductible. Upon making a donation, you will receive a receipt that can be used for tax purposes. Please consult with a tax professional for specific advice regarding your situation.",
  },
  {
    question: "Can I donate anonymously?",
    answer:
      "Yes, you can choose to donate anonymously. When making a donation, you will have the option to provide your name or donate anonymously. We respect your privacy and will not disclose your personal information without your consent.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer:
      "Yes, An-Nadaa is a registered non-profit organization and donations made to us are tax-deductible. Upon making a donation, you will receive a receipt that can be used for tax purposes. Please consult with a tax professional for specific advice regarding your situation.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer:
      "Yes, An-Nadaa is a registered non-profit organization and donations made to us are tax-deductible. Upon making a donation, you will receive a receipt that can be used for tax purposes. Please consult with a tax professional for specific advice regarding your situation.",
  },
]
</script>
<style></style>
