<template>
  <Card
    :class="`relative h-full p-0 px-4 py-1 pt-4 pb-4 transition transform bg-white rounded-lg shadow-md `"
  >
    <AspectRatio :ratio="3 / 2">
      <img
        :src="cause.thumbnail.formats?.medium?.url || cause.thumbnail.url"
        alt=""
        class="object-cover w-full h-full rounded-lg"
      />
    </AspectRatio>
    <div class="">
      <div class="pt-2 pb-6">
        <div class="flex space-x-2">
          <p
            v-for="(category, index) in cause.categories.map((category:any) => category.title)"
            :key="index"
            class="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full w-fit"
          >
            {{ category }}
          </p>
        </div>

        <h3 class="mt-2 text-lg font-normal">{{ cause.title }}</h3>

        <template v-if="isProject">
          <p class="mt-1 text-sm font-light">
            {{ cause.goalDetails[0].projectDescription }}
          </p>
          <p class="my-2 text-sm font-semibold text-gray-800">
            ${{ cause.raisedAmount?.toLocaleString() }}
            Raised
          </p>
        </template>
        <template v-else>
          <div class="flex w-full max-w-[350px] items-center space-x-3">
            <Progress
              :model-value="
                Math.round(
                  (cause.raisedAmount / cause.goalDetails[0].goalAmount) * 100
                )
              "
              class="h-[5px]"
            ></Progress>
            <p>
              {{
                Math.round(
                  (cause.raisedAmount / cause.goalDetails[0].goalAmount) * 100
                )
              }}%
            </p>
          </div>
          <p class="my-2 text-sm text-gray-800">
            ${{ cause.raisedAmount?.toLocaleString() }} of ${{
              cause.goalDetails[0].goalAmount?.toLocaleString()
            }}
            Raised
          </p>
        </template>
      </div>
      <div class="absolute flex mt-4 space-x-2 overflow-x-hidden bottom-4">
        <p
          :class="`text-xs text-gray-600 py-1 px-2  w-fit rounded-full ${
            cause.causeStatus === 'Funded'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`"
        >
          {{ cause.causeStatus }}
        </p>
        <p
          v-for="(tag, index) in cause.tags"
          :key="index"
          :class="`px-2 py-1 text-xs text-${tag.color}-600  bg-${tag.color}-100 rounded-full min-w-max`"
        >
          {{ tag.value }}
        </p>
      </div>
    </div>
    <!-- {{ cause }} -->
  </Card>
</template>

<script setup lang="ts">
import Progress from "../ui/progress/Progress.vue"
import type { ApiCauseCause } from "~/types/contentTypes"

const props = defineProps({
  cause: {
    type: Object as () => ApiCauseCause["attributes"],
    required: true,
  },
})

const isProject = props.cause.goalDetails[0].__component === "cause.project"

// type Cause = {
//   title: string
//   categories: string[]
//   images: Object[]
//   amountRaised: number
//   goalAmount: number
//   status: string
//   tags: string[]
// }

// defineProps({
//   title: {
//     type: String,
//     required: true, // Add if it's required
//     default: "Default Title", // Optional, add default value if needed
//   },
//   categoryTags: {
//     type: Array<string>,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: false,
//     default: "default-image.png",
//   },
//   amountRaised: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   goalAmount: {
//     type: Number,
//     required: true,
//     default: 1000,
//   },
//   status: {
//     type: String,
//     required: true,
//   },
//   tags: {
//     type: Array<string>,
//     required: false,
//     default: () => [],
//   },
// })
</script>

<style>
* {
  /* outline: 1px solid red; */
}
</style>
