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
        <div class="overflow-hidden aspect-16/9 rounded-2xl">
          <iframe
            class="w-full h-full"
            src="https://www.youtube.com/embed/02FKz_9VeeM?si=dDgojZO9UtqUfeF8"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>

        <VueEasyLightbox
          :visible="lightboxVisible"
          :imgs="images"
          :index="currentIndex"
          @hide="onHide"
        />

        <div :class="`relative ${images.length > 0 ? '' : 'hidden'}`">
          <flicking
            ref="flickingElement"
            class="py-4"
            :options="{ circular: true, align: { camera: '0%', panel: '0%' } }"
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

        <CauseDonateCard
          class="mt-8 sm:hidden"
          v-model="toggleIndex"
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
            class="w-full p-6 py-8 rounded-xl"
            :style="{ border: '1px solid #e1e1e1' }"
          >
            <h4 class="font-normal">Important Note</h4>
            <p class="font-light text-dark-gray">
              As you have trusted An-Nadaa to perform udhiya for you and to
              fulfill this responsibility with full Amaana (trust), we require
              some information. As one may know, the udhiya is valid only if
              performed after the Eid prayer (refer to this link for details)
              and three days following the Day of Eid. In Nigeria, Eid will most
              likely be on 28 June and some of you might be in a country where
              Eid is on a different due due to moon sighting or the time zone
              difference might be such that you finish Eid prayers when it’s
              night time in Nigeria. Keeping this in mind, do let us know where
              you will be celebrating Eid by dropping us an email on
              contact@an-nadaa.com. For any donations received without
              confirmation, the udhiya will be performed on the third day of Eid
              to be on the safe side.
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
        <CauseDonateCard
          :cause="cause"
          v-model="toggleIndex"
          :scrollToElement="scrollToElement"
        />
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
      <BankDetails class="mt-8" />
    </div>
  </div>
</template>
<script setup lang="ts">
import BankDetails from "~/components/global/BankDetails.vue"
import "@egjs/flicking-plugins/dist/flicking-plugins.css"
import VueEasyLightbox from "vue-easy-lightbox"
import img1 from "assets/media/img/1.png"
import img2 from "assets/media/img/2.png"
import img3 from "assets/media/img/3.png"
import img4 from "assets/media/img/4.png"
import img5 from "assets/media/img/5.png"
import img6 from "assets/media/img/6.png"
import Flicking from "@egjs/vue3-flicking"
import { micromark } from "micromark"

const strapiFetch = useStrapiFetch()
const route = useRoute()
const { id } = route.params
const localePath = useLocalePath()
const bankInfo = ref()
const currentIndex = ref(0)
const toggleIndex = ref(0)
const { locale } = useI18n()
const images = [img1, img2, img3, img4, img5, img6]
const flickingElement = ref<any>(null)
const lightboxVisible = ref(false)

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
// const cause = strapiResponse.value.data[0]
const causeHtml = micromark(cause.body)

const isExpanded = ref(false)

function scrollToElement() {
  bankInfo.value?.scrollIntoView({ behavior: "smooth" })
}
</script>

<style></style>
