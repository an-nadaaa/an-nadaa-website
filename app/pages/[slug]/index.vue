<template>
  <div class="container py-4">
    <!-- Simple skeleton matching the general layout of causes/[id].vue -->
    <div class="mb-4 w-fit">
      <div class="relative w-fit">
        <div class="w-32 h-6 rounded animate-pulse bg-slate-200" />
      </div>
    </div>

    <div class="w-2/3 h-8 rounded animate-pulse bg-slate-200" />

    <div class="grid gap-x-4 mt-8 lg:flex">
      <div class="basis-full lg:basis-[60%] space-y-4">
        <div class="overflow-hidden rounded-2xl animate-pulse bg-slate-200 aspect-16/9" />

        <div class="flex gap-2 mt-4">
          <div
            v-for="n in 3"
            :key="n"
            class="overflow-hidden w-24 rounded-lg animate-pulse bg-slate-200 aspect-4/3 md:w-36"
          />
        </div>

        <div class="mt-6 space-y-2">
          <div
            v-for="n in 5"
            :key="n"
            class="h-4 rounded animate-pulse bg-slate-200"
          />
        </div>
      </div>

      <div class="hidden lg:block my-0 sm:my-8 lg:my-0 basis-[40%]">
        <div class="h-64 rounded-xl animate-pulse bg-slate-200" />
      </div>
    </div>
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
      name: "description",
      content: cause.description,
    },
  ],
})

router.push(`/causes/${cause.documentId}`)
</script>

