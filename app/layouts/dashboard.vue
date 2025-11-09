<template>
  <div class="flex">
    <Sidebar />
    <div class="ml-[250px] flex-1 p-8">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import Sidebar from "@/components/dashboard/Sidebar.vue"
</script>

<style></style>
