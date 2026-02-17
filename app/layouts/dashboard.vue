<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar.vue"
import SidebarStateSync from "@/components/SidebarStateSync.vue"
import { useSidebarState } from "@/composables/useSidebarState"

const { isCollapsed } = useSidebarState()
const appConfig = useAppConfig()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarStateSync />
    <main class="flex flex-col flex-1 min-h-screen">
      <div class="flex-1">
        <div class="py-4 mb-4 w-full drop-shadow-sm bg-dark-blue md:hidden">
          <div
            class="container flex gap-4 items-center"
            :class="{ 'mx-auto': isCollapsed }"
          >
            <SidebarTrigger class="text-white" />
            <NuxtImg
              :src="(appConfig.logo as any).whiteLargeText"
              alt="An-Nadaa"
              class="ml-2 w-auto h-8"
            />
          </div>
        </div>
        <!-- <div class="container flex-1 px-4 mx-auto w-full"> -->
        <div
          class="container overflow-x-hidden px-8 pb-8 w-full max-w-screen sm:pt-4"
          :class="{ 'mx-auto': isCollapsed }"
        >
          <slot />
        </div>
      </div>
    </main>
  </SidebarProvider>
</template>
