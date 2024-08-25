<template>
  <div class="bg-light-blue py-16">
    <div class="container">
      <div class="w-full">
        <div class="w-[600px] max-w-full">
          <h6 class="text-xs font-medium text-orange-accent">HOW IT STARTS</h6>
          <h1 class="font-medium my-4">We are just getting started</h1>
          <p class="text-dark-gray font-light">
            An-Nadaa started with the renovation of a single school building in
            2014, since then it has grown into an organisation that has
            established Awqaaf and executed many projects and is building the
            community through education and welfare causes. An-Nadaa is an
            officially registered Non-Profit Organisation by the Malaysian and
            Nigerian governments.

            <br /><br />Our causes aim to build self-sustaining communities in
            which people who were once in need of support transform into someone
            who supports and uplifts others. Although we started off in Zaria
            city in Nigeria our vision is to cover the whole country and one day
            reach the whole of Africa.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:pt-28 sm:pb-20">
        <div v-for="(section, index) in sections" :key="index" class="">
          <div
            class="mt-8 sm:mt-0 grid sm:grid-cols-2 items-center gap-x-8 lg:gap-x-16"
          >
            <div
              :class="`${
                index % 2 == 0 ? 'sm:order-1' : 'sm:order-2'
              } mb-4 sm:mb-0`"
            >
              <h6
                v-if="section.subtitle"
                class="text-xs font-medium text-orange-accent"
              >
                {{ section.subtitle }}
              </h6>
              <h1 class="font-medium my-4">{{ section.title }}</h1>
              <p class="text-dark-gray font-light">{{ section.content }}</p>
            </div>
            <div :class="`${index % 2 == 0 ? 'sm:order-2' : 'sm:order-1'}`">
              <div
                class="aspect-square md:aspect-3/4 lg:aspect-square xl:aspect-4/3 overflow-hidden"
              >
                <img
                  :src="section.image"
                  :alt="section.title"
                  class="object-cover w-full h-full rounded-2xl"
                />
              </div>
            </div>
          </div>

          <div
            v-if="index % 2 == 0 && index != sections.length - 1"
            class="w-full hidden sm:block"
          >
            <img
              class="w-1/2 mx-auto"
              src="~/assets/media/img/dottedline.svg"
            />
          </div>
          <div
            v-else
            v-if="index != sections.length - 1"
            class="w-full hidden sm:block"
          >
            <img
              class="w-1/2 mx-auto"
              src="~/assets/media/img/dottedlinereversed.svg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import sheikhIbrahim from "@/assets/media/img/sheikh-ibrahim.png"
import bnw from "@/assets/media/img/darkbnw.png"
import medina from "@/assets/media/img/medina.png"
import malaysia from "@/assets/media/img/malaysia.png"
import youth from "@/assets/media/img/youth.png"

type Section = {
  subtitle?: string
  title: string
  content: string
  image: any
}

const sections: Section[] = [
  {
    subtitle: "FOUNDER (NIGERIA) & DEPUTY CHAIRMAN (MALAYSIA)",
    title: "Meet Sheikh Ibrahim Nuhu",
    content:
      "Dr. Ibrahim Nuhu Tahir is the founder of An-Nadaa Educational Foundation. He personally supervises and monitors all the activities of the foundation to ensure that they are in line with the rules of Allah, objectives of the organization and maximise the benefit for the community. All this while also ensuring the rights of the donors, partners and beneficiaries are not violated in any way.",
    image: sheikhIbrahim,
  },
  {
    title: "Early Years",
    content:
      "Dr. Ibrahim Nuhu Tahir was born and raised in Nigeria. Sheikh started his Islamic education from a young age in the classical way with his father Dr. Nuhu Tahir (may Allah preserve him) and other scholars in that region. Sheikh Ibrahim enjoys being around children which is why he started off as a primary School headmaster at Raudatul Qur’an School in Zaria city of Nigeria.",
    image: bnw,
  },
  {
    title: "Medina Education",
    content:
      "He was then accepted into the International Islamic University, Madinah. He graduated from the Dept of Shariah at the top of his class with his Bachelors in Shariah and Islamic Studies. He then followed that up with a Postgraduate Diploma (first class of honours) in Islamic Law and Islamic Political Science. Sheikh Ibrahim benefited greatly from his stay in this blessed city learning a lot from the knowledge and tarbiya of the scholars. This is where the idea of An-Nadaa was first developed.",
    image: medina,
  },
  {
    title: "Malaysia",
    content:
      "He then went on to complete his masters and PhD from Islamic International University of Malaysia. While he was doing his PhD he was also a teacher and the head of Islamic department in the International Islamic School Malaysia. After completing his PhD sheikh was invited to join the department of Economics and Management Sciences where he is now an associate professor. He is also a research fellow at the Center for Islamic Economics.",
    image: malaysia,
  },
  {
    title: "Youth Empowerment",
    content:
      "Sheikh Ibrahim allots a lot of his free time, and many times sacrifices his own family time, to engage with youth and spread the knowledge and the tarbiyyah of the deen. He conducts classes in Fiqh, Seerah, Akhlaaq, Tafseer, Faraid, essential knowledge for new muslims. Sheikh Ibrahim also holds advisory roles with many organisations and student bodies. With his deep knowledge coupled with extreme humility, Sheikh Ibrahim has significantly single-handedly developed Islam in the lives of hundreds if not thousands of Muslim youth.",
    image: youth,
  },
]
</script>
