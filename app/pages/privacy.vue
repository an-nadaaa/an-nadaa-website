<template>
  <div class="relative pt-12 pb-24 w-full">
    <img
      class="hidden absolute top-0 right-0 z-0 h-60 sm:block"
      src="assets/media/img/Line.svg"
    />

    <div class="container">
      <div class="w-full sm:w-[600px]">
        <h1 class="text-4xl font-semibold">Privacy Policy</h1>
        <p>
          At An-Nadaa, we are committed to protecting your privacy and ensuring
          the security of your personal information. This privacy policy
          outlines how we collect, use, and safeguard your data when you
          interact with our website and services.
        </p>

        <ContentRenderer
          class="mt-16 mb-12 prose prose-h1:font-normal prose-p:text-dark-gray prose-a:text-dark-gray prose-a:font-light prose-ul:text-dark-gray prose-ul:font-thin prose-headings:font-medium prose-headings:mb-2 prose-headings:mt-12 prose-blockquote:border-l-2 prose-blockquote:border-l-primary prose-blockquote:prose-p:text-2xl prose-blockquote:prose-p:font-normal prose-blockquote:prose-p:last:text-lg prose-blockquote:prose-p:last:text-dark-gray prose-blockquote:prose-p:last:not-italic prose-blockquote:my-12 prose-p:font-light"
          :value="data"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { locale } = useI18n()
const { data } = useAsyncData("privacy", () =>
  queryContent("privacy", locale.value).findOne()
)
</script>

<style scoped>
@reference "~/assets/css/tailwind.css";

p {
  @apply font-light mt-4;
}

h2 {
  @apply font-normal text-2xl;
}
</style>
