<script setup lang="ts">
import { useSidebarStore } from "@/stores/sidebar"
import { useSidebar } from "~/components/ui/sidebar"

const sidebarStore = useSidebarStore()
const { state } = useSidebar()

// Watch for changes in the shadcn sidebar state and update our store
watchEffect(() => {
  if (state.value === "expanded") {
    sidebarStore.open()
  } else if (state.value === "collapsed") {
    sidebarStore.close()
  }
})
</script>

<template>
  <!-- This component doesn't render anything, it just syncs state -->
</template>
