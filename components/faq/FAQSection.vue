<template>
  <div class="relative w-full pt-12">
    <img
      class="absolute top-0 right-0 h-60 hidden sm:block -z-0"
      src="assets/media/img/Line.svg"
    />
    <div class="container mb-16">
      <h1 class="text-4xl text-left">Frequently Asked Questions</h1>
      <p
        class="text-dark-gray text-base sm:text-sm font-light mt-4 w-[500px] max-w-full"
      >
        These are the most frequently questions we get asked. If you can't find
        what you're looking for, you can always Contact us with your enquiry.
      </p>
      <div
        class="mt-6 grid gap-x-4 gap-y-8 sm:gap-y-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        <div v-for="faq in faqs" :key="faq.question" class="">
          <h2 class="text-lg sm:text-base font-normal text-foreground">
            {{ faq.question }}
          </h2>
          <p class="text-base sm:text-sm font-light text-dark-gray mt-2">
            {{ faq.answer }}
          </p>
        </div>
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
    question: "Can I give Zakat to an-Nadaa?",
    answer:
      "Yes you can give zakat to An-Nadaa but you need to clearly specify that this money is for Zakat so we can separate it and use it only for the places where Zakat is eligible. To learn more about our zakat program you can see our Zakat program details.",
  },
  {
    question: "How can I donate to An-Nadaa?",
    answer:
      "You can make an online donation on our website either a general purpose donation or through our causes or make a direct transfer to our accounts. For alternative methods you can contact us.",
  },
  {
    question: "How can I get receipt for my donation?",
    answer:
      "For direct transfers you can send an email to contact@an-nadaa.com along with screenshot of transfer confirmation and our team will send you the invoice. For online donations you can check your donation receipt in your email inbox.",
  },
  {
    question: "How can I support An-Nadaa?",
    answer:
      "You can support An-Nadaa in many ways. the easiest and most important way is to make du’aa that Allah grants us sincerity, success and accepts whatever was done for His sake. You can spread our messages among your friend and family. You can volunteer with An-Nadaa or link us with an individual or organization that can help An-Nadaa achieve its goals. You can also donate through our causes or make a direct transfer to our accounts. For alternative methods you can contact us.",
  },
  {
    question: "How does An-Nadaa cover its expenses?",
    answer:
      "Most of An-Nadaa team is working on volunteer basis. The few employees who are salaried are covered by a few of our generous donors. The remaining operational expenses are taken up by the team. For long term sustainability An-Nadaa will cover its operational expenses through Waqf projects. You can learn more about Waqf from this workshop and see our waqf projects through this link",
  },
  {
    question: "Which country does An-nadaa operate in?",
    answer: "All of An-nadaa projects are in Nigeria.",
  },
  {
    question: "What are the service charges of An-Nadaa?",
    answer:
      "An-Nadaa has zero service charges. If a donor sends $X amount for a project then the amount that we receive after bank charges and payment processor charges is completely used for that project. We do not deduct any service charges or operational expenses from the amount received.",
  },
  {
    question: "Where is An-Nadaa registered?",
    answer:
      "An-Nadaa is registered in Nigeria and Malaysia as a non profit organization.",
  },
]
</script>
<style></style>
