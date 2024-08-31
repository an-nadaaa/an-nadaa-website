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
    <h1 class="font-medium mt-4">
      {{ cause?.title }}
    </h1>
    <div class="mt-8 grid gap-x-4 lg:flex">
      <div :class="`basis-[60%]`">
        <div class="aspect-16/9 overflow-hidden rounded-3xl">
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

        <div
          :class="`relative overflow-hidden pb-24 ${
            isExpanded ? '' : 'h-[200px]'
          }`"
        >
          <ContentRenderer
            class="mb-12 prose-a:text-dark-gray prose-a:font-light prose prose-headings:font-medium prose-li:text-dark-gray prose-ul:font-light prose-headings:text-3xl prose-headings:mb-2 prose-headings:mt-12 prose-blockquote:border-l-2 prose-blockquote:border-l-primary prose-p:prose-blockquote:text-2xl prose-p:prose-blockquote:font-normal last:prose-p:prose-blockquote:text-lg last:prose-p:prose-blockquote:text-dark-gray last:prose-p:prose-blockquote:not-italic prose-blockquote:my-12 prose-p:font-light"
            :value="cause"
          />

          <div
            class="p-6 py-8 rounded-xl w-full"
            :style="{ border: '1px solid #e1e1e1' }"
          >
            <h4 class="font-normal">Important Note</h4>
            <p class="text-dark-gray font-light">
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
      <div class="basis-[40%] p-4 shadow-md h-fit rounded-xl">
        <h3 class="text-xl font-normal">
          <strong class="text-xl font-semibold">
            ${{ formatCurrency(cause.raisedAmount) }}
          </strong>
          of ${{ formatCurrency(cause.goalAmount) }} raised
        </h3>
        <Tag class="my-2" text="20 days left" :variant="'purple'" />
        <p class="text-dark-gray font-thin">
          Your donation will make a difference no matter how little
        </p>
        <Toggle
          class="mt-2 mb-4"
          :states="['Monthly', 'One-time']"
          v-model="toggleIndex"
        />
        <div class="relative">
          <Input class="w-full" :placeholder="'Enter amount'"></Input>
          <div class="absolute top-0 right-0">
            <Select class="">
              <SelectTrigger class="border-l-0 rounded-l-none">
                <SelectValue placeholder="$" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="usd"> $ </SelectItem>
                  <SelectItem value="myr"> RM </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="mt-4">
          <Button class="w-full">Make donation</Button>
          <Button variant="white" class="w-full mt-2"
            >Donate to An-Nadaa bank account</Button
          >
        </div>

        <p
          class="flex font-light justify-center items-center mt-4 hover:cursor-pointer hover:underline"
        >
          <Icon name="lucide:share-2" class="mr-2"></Icon> Share with family and
          friends
        </p>
      </div>
    </div>
    <div class="w-full py-16">
      <h2 class="font-medium">Direct transfers</h2>
      <p class="text-dark-gray font-normal mt-2">
        When doing a direct transfer we need our donors to send us an email
        detailing the purpose of the donation and a proof of transfer especially
        if it's for Zakat purpose.
        <NuxtLink class="text-primary underline" :to="localePath('/contact')">
          Contact information can be found here
        </NuxtLink>
      </p>
      <BankDetails class="mt-8" />
    </div>
  </div>
</template>
<script setup lang="ts">
import Tag from "~/components/global/Tag.vue"
import BankDetails from "~/components/global/BankDetails.vue"
import Toggle from "~/components/global/Toggle.vue"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const toggleIndex = ref(0)
const { locale } = useI18n()
const { data: cause } = await useAsyncData("cause", () =>
  queryContent("causes", locale.value).findOne()
)

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const isExpanded = ref(false)
</script>
