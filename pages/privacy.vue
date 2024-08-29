<template>
  <div class="relative w-full pt-12">
    <img
      class="absolute top-0 right-0 h-60 hidden sm:block -z-0"
      src="assets/media/img/Line.svg"
    />

    <div class="container">
      <div class="w-full sm:w-[600px]">
        <h1 class="font-semibold text-4xl">Privacy Policy</h1>
        <p>
          At An-Nadaa, we are committed to protecting your privacy and ensuring
          the security of your personal information. This privacy policy
          outlines how we collect, use, and safeguard your data when you
          interact with our website and services.
        </p>

        <ContentRenderer
          class="mt-16 mb-12 prose prose-h1:font-normal prose-p:text-dark-gray prose-ul:text-dark-gray prose-ul:font-thin prose-headings:font-medium prose-headings:mb-2 prose-headings:mt-12 prose-blockquote:border-l-2 prose-blockquote:border-l-primary prose-p:prose-blockquote:text-2xl prose-p:prose-blockquote:font-normal last:prose-p:prose-blockquote:text-lg last:prose-p:prose-blockquote:text-dark-gray last:prose-p:prose-blockquote:not-italic prose-blockquote:my-12 prose-p:font-light"
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
p {
  @apply font-light mt-4;
}

h2 {
  @apply font-normal text-2xl;
}
</style>
