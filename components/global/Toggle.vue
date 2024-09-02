<template>
  <div>
    <div
      :class="`p-1 relative bg-gray-100 rounded-md grid grid-cols-${states.length}`"
    >
      <div
        :class="`absolute bg-white z-0 ml-1 mt-1 shadow-md rounded-md transition-all left-[${Math.round(
          (currentIndex / states.length) * 100
        )}%]`"
        :style="{
          height: 'calc(100% - 8px)',
          width: `calc(${Math.round((1 / states.length) * 100)}% - 8px)`,
        }"
      ></div>
      <div
        v-for="(state, index) in states"
        @click="() => toggle(index)"
        :key="index"
        class="p-1 z-10 hover:cursor-pointer"
      >
        <p
          :class="`text-center font-normal ${
            currentIndex === index ? 'text-foreground' : 'text-gray-400'
          }`"
        >
          {{ state }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  states: {
    type: Array<string>,
    required: true,
  },
})

// const toggleIndex = toRef(props, "toggleIndex")
const toggleIndex = defineModel()
const currentIndex = computed(() => {
  if (toggleIndex.value) return toggleIndex.value

  return 0
})

function toggle(index: number) {
  // console.log(index)

  toggleIndex.value = index
}
</script>
