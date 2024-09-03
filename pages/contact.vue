<template>
  <div class="container py-8">
    <h1 class="">Get in touch to start collaboration/projects with An-Nadaa</h1>
    <div class="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-8 sm:gap-y-20">
      <Card class="p-6 space-y-3 text-foreground">
        <h3 class="font-medium">Emails</h3>
        <p class="font-light text-dark-gray">
          You can contact us via those emails
        </p>

        <div>
          <h4>Collaborate</h4>
          <a> salam@an-nadaa.com</a>
        </div>
        <div>
          <h4>Press</h4>
          <a> media@an-nadaa.com</a>
        </div>

        <div>
          <h4>Technical</h4>
          <a> tech@an-nadaa.com</a>
        </div>

        <div>
          <h4>Join us</h4>
          <a> volunteer@an-nadaa.com</a>
        </div>
      </Card>
      <Card class="p-6 space-y-3 text-foreground">
        <h3 class="font-medium">Locations</h3>
        <div>
          <h4>Malaysia</h4>
          <p class="font-light text-dark-gray">
            Unit B-1-7 Streetmall Jalan Gerbang, Seksyen 15 <br />
            43650 Bandar Baru Bangi Selangor, Malaysia <br />
            Phone number <br />
            +60 19-605 3686 <br />
            Mon-Fri 9am to 5pm (GMT+8)
          </p>
        </div>
        <div>
          <h4>Nigeria</h4>
          <p class="font-light text-dark-gray">
            Plot No 3 Road J <br />
            Zaria Bye pass Layout Zaria, Kaduna State Nigeria <br />
            Phone number <br />
            +234 706-244 4989 <br />
            +234 701-074 8086 <br />
            Mon-Fri 8am to 5pm (GMT+1)
          </p>
        </div>
      </Card>
      <div>
        <h1>Send us a message</h1>
        <p class="font-light text-dark-gray mt-4">
          We will get back to you as soon as we can.
        </p>
      </div>
      <Card class="p-6"> </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
</script>

<style scoped>
h1 {
  @apply font-medium text-4xl text-balance;
}

h4 {
  @apply font-medium text-lg;
}

a {
  @apply text-dark-gray font-light underline text-base hover:cursor-pointer;
}
</style>
