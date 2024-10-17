<template>
  <div class="container py-16">
    <div class="px-0 lg:px-32 xl:px-44">
      <h1 class="font-normal text-center">{{ blog?.title }}</h1>
      <p class="my-4 text-center text-dark-gray">
        {{ formateDayMonthYear(blog?.createdAt) }}
      </p>
    </div>

    <div class="lg:px-16">
      <div class="w-full overflow-hidden h-96 rounded-2xl">
        <NuxtImg
          class="object-cover w-full h-full"
          :alt="blog?.title"
          :src="blog?.image.formats.large.url"
        />
      </div>
    </div>

    <div class="px-0 mt-12 lg:px-32 xl:px-44">
      <div class="border-b-[1px] border-b-gray-200">
        <div
          v-html="blogHtml"
          class="mb-12 prose prose-h1:font-normal prose-headings:mb-2 prose-headings:mt-12 prose-blockquote:border-l-2 prose-blockquote:border-l-primary prose-p:prose-blockquote:text-2xl prose-p:prose-blockquote:font-normal last:prose-p:prose-blockquote:text-lg last:prose-p:prose-blockquote:text-dark-gray last:prose-p:prose-blockquote:not-italic prose-blockquote:my-12 prose-p:font-light"
        ></div>
        <!-- <ContentRenderer
          class="mb-12 prose prose-h1:font-normal prose-headings:mb-2 prose-headings:mt-12 prose-blockquote:border-l-2 prose-blockquote:border-l-primary prose-p:prose-blockquote:text-2xl prose-p:prose-blockquote:font-normal last:prose-p:prose-blockquote:text-lg last:prose-p:prose-blockquote:text-dark-gray last:prose-p:prose-blockquote:not-italic prose-blockquote:my-12 prose-p:font-light"
          :value="blog"
        /> -->
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
          <Button :variant="'white'" @click="handleCopyLink">
            <Icon v-if="!copyClicked" name="lucide:copy" class="mr-2" />
            {{ copyClicked ? "Copied!" : "Copy link" }}
          </Button>
          <Button
            @click="handleTwitterClick"
            class="p-1 text-dark-gray"
            :variant="'white'"
          >
            <Icon name="bxl:twitter" class="w-6" />
          </Button>
          <Button
            @click="handleFacebookClick"
            class="p-1 text-dark-gray"
            :variant="'white'"
          >
            <Icon name="bxl:facebook-circle" class="w-6" />
          </Button>
          <Button
            @click="handleLinkedinClick"
            class="p-1 text-dark-gray"
            :variant="'white'"
          >
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
import { micromark } from "micromark"

const copyClicked = ref(false)
const strapiFetch = useStrapiFetch()
const { locale } = useI18n()
const { formateDayMonthYear } = useDateFormatter()
const route = useRoute()
const pageUrl = window.location.href
// const blogId = route.params.id;
// todo: change blogId to id from route
const blogId = "dvldqyc45ub0ql2xnyg4yb2t"

const blog = await strapiFetch(
  "/blogs/" + blogId,
  "GET",
  {},
  {
    populate: "image",
    locale: locale.value,
  }
).then((res) => {
  if (res.error.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "Blog not found",
      fatal: true,
    })
  }
  return res.data.value.data
})
const blogHtml = micromark(blog.body)

useHead({
  title: blog.title,
  meta: [{ name: "description", content: blog.description }],
})

function handleCopyLink() {
  const textToCopy = `Check out this blog from An-Nadaa titled "${blog?.title}": ${pageUrl}`
  navigator.clipboard.writeText(textToCopy)

  copyClicked.value = true
  setTimeout(() => {
    copyClicked.value = false
  }, 2000)
}

function handleTwitterClick() {
  const url = `https://twitter.com/intent/tweet?text=Check+out+this+blog+from+An-Nadaa+titled+${encodeURIComponent(
    blog.title
  )}%3A+${encodeURIComponent(pageUrl)}`

  window.open(url, "_blank")
}

function handleFacebookClick() {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    pageUrl
  )}`

  // &quote=Check+out+this+blog+from+An-Nadaa+titled+${encodeURIComponent(
  //   blog.title
  // )}`

  window.open(url, "_blank")
}

function handleLinkedinClick() {
  const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    pageUrl
  )}&title=${encodeURIComponent(
    blog.title
  )}&summary=Check+out+this+blog+from+An-Nadaa`

  window.open(url, "_blank")
}

// const { content, data } = matter(markdownContent)
// const body = sanitizeHtml(await marked.parse(content))
</script>
