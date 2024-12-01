<template>
  <div class="container py-8">
    <div class="w-full">
      <NuxtLink to="/causes">
        <Button :variant="'white'">
          <Icon :name="'lucide:arrow-left'" class="mr-2" />
          Back to causes</Button
        >
      </NuxtLink>
    </div>
    <h1 class="mt-4 font-medium">
      {{ cause?.title }}
    </h1>
    <div class="grid mt-8 gap-x-4 lg:flex">
      <div :class="`basis-[60%]`">
        <template v-if="cause.videoPath">
          <div class="overflow-hidden aspect-16/9 rounded-2xl">
            <!-- <VideoPlayer
              class="w-full h-full"
              :src="cause.videoPath"
              :thumbnail="
                cause.thumbnail.formats?.large?.url || cause.thumbnail.url
              "
            ></VideoPlayer> -->
            <iframe
              class="w-full h-full"
              :src="cause.videoPath"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>

          <div :class="`relative ${images.length > 0 ? '' : 'hidden'}`">
            <flicking
              ref="flickingElement"
              class="py-4"
              :options="{
                circular: true,
                align: { camera: '0%', panel: '0%' },
              }"
            >
              <div
                v-for="(image, index) in images"
                :key="index"
                @click="
                  () => {
                    currentIndex = index
                    lightboxVisible = true
                  }
                "
                class="mr-2 overflow-hidden rounded-lg aspect-4/3 hover:cursor-pointer"
              >
                <img :src="image" class="object-cover w-24 h-full md:w-36" />
              </div>
            </flicking>

            <div class="absolute flex justify-between w-full top-1/2">
              <div
                @click="() => flickingElement?.prev()"
                class="hover:cursor-pointer shadow-md -translate-y-1/2 -translate-x-[30%] bg-white h-10 w-10 p-2 rounded-full z-50"
              >
                <Icon
                  name="lucide:arrow-left"
                  class="h-full w-full text-primary relative -translate-x-[0px]"
                ></Icon>
              </div>

              <div
                @click="() => flickingElement?.next()"
                class="right-0 hover:cursor-pointer shadow-md -translate-y-1/2 translate-x-[30%] bg-white h-10 w-10 p-2 rounded-full z-50"
              >
                <Icon
                  name="lucide:arrow-right"
                  class="h-full w-full text-primary relative -translate-x-[0px]"
                ></Icon>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <flicking
            ref="flickingElementBig"
            class="aspect-16/9 rounded-2xl"
            :options="{ circular: true }"
            :plugins="plugins"
          >
            <div
              v-for="(image, index) in images"
              @click="
                () => {
                  currentIndex = index
                  lightboxVisible = true
                }
              "
              :key="index"
              class="relative flex items-center justify-center w-full overflow-hidden"
            >
              <div class="absolute inset-0">
                <img :src="image" class="object-cover w-full h-full blur-lg" />
              </div>
              <img
                :src="image"
                class="relative z-10 object-contain max-w-full max-h-full"
              />
            </div>
            <template #viewport>
              <span class="flicking-arrow-prev is-thin"></span>
              <span class="flicking-arrow-next is-thin"></span>
            </template>
          </flicking>
        </template>

        <VueEasyLightbox
          :visible="lightboxVisible"
          :imgs="images"
          :index="currentIndex"
          @hide="onHide"
        />

        <CauseDonateCard
          class="mt-8 sm:hidden"
          :cause="cause"
          :scrollToElement="scrollToElement"
        />

        <!-- <p>
          {{ causeHtml }}
        </p> -->
        <div
          :class="`relative overflow-hidden pb-24 ${
            isExpanded ? '' : 'h-[200px]'
          }`"
        >
          <div
            class="mb-12 prose prose-a:text-dark-gray prose-a:font-light prose-headings:font-medium prose-li:text-dark-gray prose-ul:font-light prose-headings:text-3xl prose-headings:mb-2 prose-headings:mt-12 prose-blockquote:border-l-2 prose-blockquote:border-l-primary prose-p:prose-blockquote:text-2xl prose-p:prose-blockquote:font-normal last:prose-p:prose-blockquote:text-lg last:prose-p:prose-blockquote:text-dark-gray last:prose-p:prose-blockquote:not-italic prose-blockquote:my-12 prose-p:font-light"
            v-html="causeHtml"
          />

          <!-- <ContentRenderer
            class="mb-12 prose prose-a:text-dark-gray prose-a:font-light prose-headings:font-medium prose-li:text-dark-gray prose-ul:font-light prose-headings:text-3xl prose-headings:mb-2 prose-headings:mt-12 prose-blockquote:border-l-2 prose-blockquote:border-l-primary prose-p:prose-blockquote:text-2xl prose-p:prose-blockquote:font-normal last:prose-p:prose-blockquote:text-lg last:prose-p:prose-blockquote:text-dark-gray last:prose-p:prose-blockquote:not-italic prose-blockquote:my-12 prose-p:font-light"
            :value="caus"
          /> -->

          <div
            v-if="cause.importantNote && cause.importantNote.length > 0"
            class="w-full p-6 py-8 rounded-xl"
            :style="{ border: '1px solid #e1e1e1' }"
          >
            <h4 class="font-normal">Important Note</h4>
            <p class="font-light text-dark-gray">
              {{ cause.importantNote }}
            </p>
          </div>

          <div
            :class="`absolute inset-0 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-white after:to-transparent after:opacity-100 pointer-events-none ${
              isExpanded ? 'hidden' : ''
            }`"
          ></div>

          <Button
            @click="
              () => {
                isExpanded = !isExpanded
              }
            "
            class="absolute bottom-0 right-0"
            :variant="'white'"
            >{{ isExpanded ? "Show less" : "Read more" }}

            <Icon
              :name="isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'"
              class="ml-2"
            />
          </Button>
        </div>
      </div>
      <div class="hidden sm:block my-0 sm:my-8 lg:my-0 basis-[40%]">
        <CauseDonateCard :cause="cause" :scrollToElement="scrollToElement" />
      </div>
    </div>
    <div ref="bankInfo" class="w-full py-16">
      <h2 class="font-medium">Direct transfers</h2>
      <p class="mt-2 font-normal text-dark-gray">
        When doing a direct transfer we need our donors to send us an email
        detailing the purpose of the donation and a proof of transfer especially
        if it's for Zakat purpose.
        <NuxtLink class="underline text-primary" :to="localePath('/contact')">
          Contact information can be found here
        </NuxtLink>
      </p>
      <BankDetails
        :class="{
          'mt-8': true,
          'opacity-50 pointer-events-none': !cause.isActive,
        }"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import BankDetails from "~/components/global/BankDetails.vue"
import "@egjs/flicking-plugins/dist/flicking-plugins.css"
import VueEasyLightbox from "vue-easy-lightbox"
import Flicking from "@egjs/vue3-flicking"
import { micromark } from "micromark"
import { Arrow } from "@egjs/flicking-plugins"
import "@egjs/flicking-plugins/dist/arrow.css"
// import VideoPlayer from "~/components/global/VideoPlayer.vue"

const strapiFetch = useStrapiFetch()
const route = useRoute()
const { id } = route.params
const localePath = useLocalePath()
const bankInfo = ref()
const index = ref(0)
const currentIndex = ref(0)
const { locale } = useI18n()
const flickingElement = ref<any>(null)
const flickingElementBig = ref<any>(null)
const lightboxVisible = ref(false)
const plugins = [new Arrow()]

const onHide = () => {
  lightboxVisible.value = false
}

const cause = await strapiFetch(
  "/causes/" + id,
  "GET",
  {
    populate: "*",
    locale: locale.value,
  },
  {}
).then((res: any) => {
  if (res.error.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "Cause not found",
      fatal: true,
    })
  }

  return res.data.value.data
})

let images: any[] = []

if (cause.images) {
  images = [
    cause.thumbnail.formats?.large?.url || cause.thumbnail.url,
    ...cause.images.map((image: any) => {
      return image.url
    }),
  ]
}
// const cause = strapiResponse.value.data[0]
const causeHtml = micromark(cause.body || "")

const isExpanded = ref(false)

function scrollToElement() {
  bankInfo.value?.scrollIntoView({ behavior: "smooth" })
}
</script>

<style scoped>
.flicking-arrow-prev {
  @apply text-primary;
}

.flicking-arrow-prev:before,
.flicking-arrow-next:before,
.flicking-arrow-prev:after,
.flicking-arrow-next:after {
  @apply bg-primary;
}
</style>
