<template>
  <div>
    <!-- <h1>{{ slug }}</h1> -->
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const slug = ref(route.params.slug)
const strapiFetch = useStrapiFetch()

const cause = await strapiFetch(
  "/causes",
  "GET",
  {},
  {
    filters: {
      slug: slug.value,
    },
  }
).then((res) => {
  if (res.data.value.data && res.data.value.data.length > 0) {
    const cause = res.data.value.data[0]
    return cause
    // router.push(`/causes/${cause.documentId}`)
  } else {
    throw createError({
      statusCode: 404,
      message: "Page not found",
      fatal: true,
    })
  }
})

useHead({
  title: cause.title,
  meta: [
    {
      hid: "description",
      name: "description",
      content: cause.description,
    },
  ],
})

router.push(`/causes/${cause.documentId}`)
</script>
<style lang=""></style>
