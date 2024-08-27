<template>
  <div class="container py-16">
    <div class="px-0 lg:px-44">
      <h1 class="text-center font-normal">{{ blog?.title }}</h1>
      <p class="text-center text-dark-gray my-4">
        {{ formatDate(blog?.date) }}
      </p>
    </div>

    <div class="lg:px-16">
      <div class="w-full h-96 overflow-hidden rounded-2xl">
        <NuxtImg
          class="w-full h-full object-cover"
          :alt="blog?.title"
          :src="blog?.image"
        />
      </div>
    </div>

    <div class="mt-12 px-0 lg:px-36">
      <ContentRendererMarkdown :value="blog" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { formatDate } from "~/lib/utils"

const { locale } = useI18n()
const route = useRoute()
const blogId = route.params.id

const { data: blog } = await useAsyncData("blog", () =>
  queryContent("blogs", locale.value)
    .where({ _path: `/blogs/${locale.value}/${blogId}` })
    .findOne()
)

function getUrl(img: string) {
  return require(img)
}
</script>
