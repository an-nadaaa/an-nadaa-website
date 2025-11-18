<template>
  <Toaster />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

useHead({
  title: appConfig.siteName as string,
  meta: [{ name: "description", content: appConfig.siteDescription as string }],
})
</script>
