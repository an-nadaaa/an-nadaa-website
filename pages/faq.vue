<template>
  <div>
    <FAQSection />
    <div class="container mt-16 mb-8 sm:mb-16">
      <div
        class="w-full rounded-md bg-slate-50 p-6 flex flex-col gap-y-4 sm:flex-row sm:justify-between"
      >
        <div>
          <h6 class="font-normal">Still have questions?</h6>
          <p class="text-dark-gray mt-2">
            Can’t find the answer you’re looking for? Please reach out our team.
          </p>
        </div>
        <Button class="w-fit">Contact us</Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LanguageVariant } from "typescript"
import FAQSection from "../components/faq/FAQSection.vue"
</script>
