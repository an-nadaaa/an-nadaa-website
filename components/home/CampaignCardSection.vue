<template>
  <Card
    class="p-0 px-4 py-1 pt-4 transition transform bg-white rounded-lg shadow-md"
  >
    <AspectRatio :ratio="3 / 2">
      <img :src="image" alt="" class="object-cover w-full h-full rounded-lg" />
    </AspectRatio>
    <div class="py-4">
      <div class="flex space-x-2">
        <p
          v-for="(category, index) in categoryTags"
          :key="index"
          class="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full w-fit"
        >
          {{ category }}
        </p>
      </div>

      <h3 class="mt-2 text-lg font-normal">{{ title }}</h3>
      <div class="flex w-full max-w-[350px] items-center space-x-3">
        <Progress
          :model-value="Math.round((amountRaised / goalAmount) * 100)"
          class="h-[5px]"
        ></Progress>
        <p>{{ Math.round((amountRaised / goalAmount) * 100) }}%</p>
      </div>
      <p class="my-2 text-sm text-gray-800">
        ${{ amountRaised?.toLocaleString() }} of ${{
          goalAmount?.toLocaleString()
        }}
        Raised
      </p>
      <div class="flex mt-4 space-x-2 overflow-x-hidden">
        <p
          :class="`text-xs text-gray-600 py-1 px-2  w-fit rounded-full ${
            status === 'Funded'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`"
        >
          {{ status }}
        </p>
        <p
          v-for="(tag, index) in tags"
          :key="index"
          class="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded-full min-w-max"
        >
          {{ tag }}
        </p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Progress from "../ui/progress/Progress.vue"

defineProps({
  title: {
    type: String,
    required: true, // Add if it's required
    default: "Default Title", // Optional, add default value if needed
  },
  categoryTags: {
    type: Array<string>,
    required: true,
  },
  image: {
    type: String,
    required: false,
    default: "default-image.png",
  },
  amountRaised: {
    type: Number,
    required: true,
    default: 0,
  },
  goalAmount: {
    type: Number,
    required: true,
    default: 1000,
  },
  status: {
    type: String,
    required: true,
  },
  tags: {
    type: Array<string>,
    required: false,
    default: () => [],
  },
})
</script>

<style>
* {
  /* outline: 1px solid red; */
}
</style>
