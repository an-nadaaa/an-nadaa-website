<template>
  <div class="fixed top-0 right-0 bg-white">
    <p>is logged in {{ loggedIn }}</p>
    <p>user {{ user?.user?.username }}</p>
  </div>

  <Toaster />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

const { loggedIn, user } = useUserSession()

useHead({
  title: appConfig.siteName as string,
  meta: [{ name: "description", content: appConfig.siteDescription as string }],
})
</script>
