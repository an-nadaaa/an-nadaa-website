<template>
  <div class="relative">
    <img
      src="assets/media/img/Line.svg"
      class="absolute top-0 right-0 hidden h-60 sm:block -z-0"
    />

    <div class="container py-12">
      <h1 class="font-medium">An-Nadaa Blog</h1>
      <p class="max-w-2xl mt-4 text-dark-gray">
        We're delving into the heart of An-Nadaa's mission – a mission that
        encompasses projects, outreach, donations, and our profound contribution
        to society. Our journey is a testament to the power of collective action
        and the potential for positive change.
      </p>
      <div class="grid mt-8 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-8">
        <div class="group" v-for="(blog, index) in blogs" :key="index">
          <NuxtLink :to="`/blogs/${blog.id}`">
            <div class="overflow-hidden h-80">
              <img
                :src="blog.image"
                class="object-cover w-full h-full rounded-xl"
              />
            </div>
            <div class="mt-1 group-hover:underline">
              <h2 class="text-2xl font-normal text-foreground">
                {{ blog.title }}
              </h2>
              <p class="text-sm text-dark-gray">
                {{ formateDayMonthYear(blog.createdAt) }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div class="w-full">
        <Button
          :variant="'white'"
          class="relative w-full mt-4 -translate-x-1/2 sm:w-80 left-1/2"
          >Load more</Button
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import img1 from "~/assets/media/img/1.png";
import img2 from "~/assets/media/img/2.png";
import img3 from "~/assets/media/img/3.png";

const { formateDayMonthYear } = useDateFormatter();

type Blog = {
  title: string;
  description: string;
  image: string;
  createdAt: string;
  id: string;
};

const blogs = ref<Blog[]>([]);

blogs.value = [
  {
    title: "The Power of Zakat",
    description:
      "Zakat is a powerful tool for social change. It is a means of redistributing wealth and ensuring that those in need are supported. At An-Nadaa, we believe in the power of Zakat to transform lives and create a more just and equitable society.",
    image: img1,
    createdAt: "2021-10-01",
    id: "1",
  },
  {
    title: "Education for All",
    description:
      "Education is a fundamental human right. It is the key to unlocking opportunities and creating a better future for all. At An-Nadaa, we are committed to providing quality education to children in need, empowering them to reach their full potential.",
    image: img2,
    createdAt: "2021-09-15",
    id: "2",
  },
  {
    title: "Building Sustainable Communities",
    description:
      "Sustainability is at the heart of everything we do at An-Nadaa. We believe in building communities that are resilient, self-sufficient, and environmentally conscious. Through our projects and initiatives, we are working to create a more sustainable future for all.",
    image: img3,
    createdAt: "2021-08-30",
    id: "3",
  },
  {
    title: "The Power of Zakat",
    description:
      "Zakat is a powerful tool for social change. It is a means of redistributing wealth and ensuring that those in need are supported. At An-Nadaa, we believe in the power of Zakat to transform lives and create a more just and equitable society.",
    image: img1,
    createdAt: "2021-10-01",
    id: "4",
  },
  {
    title: "Education for All",
    description:
      "Education is a fundamental human right. It is the key to unlocking opportunities and creating a better future for all. At An-Nadaa, we are committed to providing quality education to children in need, empowering them to reach their full potential.",
    image: img2,
    createdAt: "2021-09-15",
    id: "5",
  },
  {
    title: "The Power of Zakat",
    description:
      "Zakat is a powerful tool for social change. It is a means of redistributing wealth and ensuring that those in need are supported. At An-Nadaa, we believe in the power of Zakat to transform lives and create a more just and equitable society.",
    image: img1,
    createdAt: "2021-10-01",
    id: "4",
  },
  {
    title: "Education for All",
    description:
      "Education is a fundamental human right. It is the key to unlocking opportunities and creating a better future for all. At An-Nadaa, we are committed to providing quality education to children in need, empowering them to reach their full potential.",
    image: img2,
    createdAt: "2021-09-15",
    id: "5",
  },
  {
    title: "The Power of Zakat",
    description:
      "Zakat is a powerful tool for social change. It is a means of redistributing wealth and ensuring that those in need are supported. At An-Nadaa, we believe in the power of Zakat to transform lives and create a more just and equitable society.",
    image: img1,
    createdAt: "2021-10-01",
    id: "4",
  },
  {
    title: "Education for All",
    description:
      "Education is a fundamental human right. It is the key to unlocking opportunities and creating a better future for all. At An-Nadaa, we are committed to providing quality education to children in need, empowering them to reach their full potential.",
    image: img2,
    createdAt: "2021-09-15",
    id: "5",
  },
  {
    title: "The Power of Zakat",
    description:
      "Zakat is a powerful tool for social change. It is a means of redistributing wealth and ensuring that those in need are supported. At An-Nadaa, we believe in the power of Zakat to transform lives and create a more just and equitable society.",
    image: img1,
    createdAt: "2021-10-01",
    id: "4",
  },
  {
    title: "Education for All",
    description:
      "Education is a fundamental human right. It is the key to unlocking opportunities and creating a better future for all. At An-Nadaa, we are committed to providing quality education to children in need, empowering them to reach their full potential.",
    image: img2,
    createdAt: "2021-09-15",
    id: "5",
  },
];
</script>
