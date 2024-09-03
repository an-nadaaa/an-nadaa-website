<template>
  <div>
    <FAQSection />
    <div class="container mt-16 mb-8 sm:mb-16">
      <div
        class="flex flex-col w-full p-6 rounded-md bg-slate-50 gap-y-4 sm:flex-row sm:justify-between"
      >
        <div>
          <h6 class="font-normal">Still have questions?</h6>
          <p class="mt-2 text-dark-gray">
            Can’t find the answer you’re looking for? Please reach out our team.
          </p>
        </div>
        <Button class="w-fit">Contact us</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FAQSection from "../components/faq/FAQSection.vue"
</script>
