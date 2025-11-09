<template>
  <div
    class="hidden lg:block fixed w-[250px] bg-dark-blue text-white p-4 h-screen"
  >
    <NuxtLink :to="$localePath('/')">
      <NuxtImg
        class="my-3 ml-3 w-40"
        :src="appConfig.logo.whiteLargeText"
      ></NuxtImg>
    </NuxtLink>
    <div class="w-full border-gray-600 border-b mb-4"></div>
    <div class="flex flex-col justify-between h-full">
      <div>
        <NuxtLink :to="$localePath('/dashboard')">
          <div class="p-4 text-lg rounded-md hover:bg-gray-700">
            <Icon name="lucide:chart-column-increasing" class="mr-4"></Icon
            >Dashboard
          </div>
        </NuxtLink>
        <NuxtLink :to="$localePath('/donations')">
          <div class="p-4 text-lg rounded-md hover:bg-gray-700">
            <Icon name="tabler:stack-3" class="mr-4"></Icon>Donation History
          </div>
        </NuxtLink>
        <NuxtLink :to="$localePath('/donations')">
          <div class="p-4 text-lg rounded-md hover:bg-gray-700">
            <Icon name="ic:outline-library-add-check" class="mr-4"></Icon>Causes
          </div>
        </NuxtLink>
      </div>

      <div>
        <NuxtLink :to="$localePath('/donations')">
          <div class="p-4 text-lg rounded-md hover:bg-gray-700">
            <Icon name="ic:round-support" class="mr-4"></Icon>Support
          </div>
        </NuxtLink>
        <NuxtLink :to="$localePath('/donations')">
          <div class="p-4 text-lg rounded-md hover:bg-gray-700">
            <Icon name="lucide:settings" class="mr-4"></Icon>Settings
          </div>
        </NuxtLink>
      </div>
    </div>

    <div class="w-full border-gray-600 border-b mb-4"></div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
})
const appConfig = useAppConfig()

const user = useStrapiUser()
</script>
