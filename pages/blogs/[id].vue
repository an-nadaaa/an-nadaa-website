<template>
  <div class="container py-16">
    <div class="px-0 lg:px-32 xl:px-44">
      <h1 class="font-normal text-center">{{ blog?.title }}</h1>
      <p class="my-4 text-center text-dark-gray">
        {{ formateDayMonthYear(blog?.date) }}
      </p>
    </div>

    <div class="lg:px-16">
      <div class="w-full overflow-hidden h-96 rounded-2xl">
        <NuxtImg
          class="object-cover w-full h-full"
          :alt="blog?.title"
          :src="blog?.image"
        />
      </div>
    </div>

    <div class="px-0 mt-12 lg:px-32 xl:px-44">
      <div class="border-b-[1px] border-b-gray-200">
        <ContentRenderer
          class="mb-12 prose prose-h1:font-normal prose-headings:mb-2 prose-headings:mt-12 prose-blockquote:border-l-2 prose-blockquote:border-l-primary prose-p:prose-blockquote:text-2xl prose-p:prose-blockquote:font-normal last:prose-p:prose-blockquote:text-lg last:prose-p:prose-blockquote:text-dark-gray last:prose-p:prose-blockquote:not-italic prose-blockquote:my-12 prose-p:font-light"
          :value="blog"
        />
      </div>
      <!-- <div
      class="px-0 mt-12 prose lg:px-44 prose-h1:font-normal prose-h1:mb-2 prose-h1:mt-12 prose-p:mt-0 prose-p:dark-gray prose-p:font-light prose-blockquote:border-l-primary prose-p:prose-blockquote:text-xl prose-p:prose-blockquote:font-normal"
      v-html="body"
    ></div> -->

      <div
        class="flex flex-col justify-between w-full mt-4 gap-y-3 sm:flex-row"
      >
        <p class="text-dark-gray">Share this post</p>

        <div class="flex gap-x-2">
          <Button :variant="'white'">
            <Icon name="lucide:copy" class="mr-2" /> Copy link</Button
          >
          <Button class="p-1 text-dark-gray" :variant="'white'">
            <Icon name="bxl:twitter" class="w-6" />
          </Button>
          <Button class="p-1 text-dark-gray" :variant="'white'">
            <Icon name="bxl:facebook-circle" class="w-6" />
          </Button>
          <Button class="p-1 text-dark-gray" :variant="'white'">
            <Icon name="bxl:linkedin-square" class="w-6" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// import matter from "gray-matter"
// import { marked } from "marked"
// import sanitizeHtml from "sanitize-html"

const { locale } = useI18n();
const { formateDayMonthYear } = useDateFormatter();
const route = useRoute();
const blogId = route.params.id;

const { data: blog } = await useAsyncData("blog", () =>
  queryContent("blogs", locale.value)
    .where({ _path: `/blogs/${locale.value}/${blogId}` })
    .findOne()
);

// const { content, data } = matter(markdownContent)
// const body = sanitizeHtml(await marked.parse(content))
</script>
