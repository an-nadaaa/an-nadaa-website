<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="p-6 rounded-xl outline outline-1 outline-gray-300">
      <div class="grid w-full lg:flex gap-y-4 gap-x-12">
        <div class="w-full">
          <h4 class="font-normal">Nigeria Dollar Account</h4>
          <p class="font-light text-dark-gray">
            You can transfer funds directly to our bank account in Nigeria (USD)
          </p>
        </div>
        <Button @click="copyNigeriaAccount" :variant="'white'">
          <template v-if="copyClicked.nigeria">
            <Icon name="lucide:check" class="mr-2" />
            Copied
          </template>
          <template v-else>
            <Icon name="lucide:copy" class="mr-2" /> Copy
          </template>
        </Button>
      </div>

      <div class="w-full pt-4 space-y-4 text-gray-700">
        <div class="flex items-start space-x-4">
          <Icon name="lucide:banknote" class="w-6 h-6"></Icon>
          <div>
            <div class="font-medium">Bank Name</div>
            <div class="text-gray-500">Bank Guaranty Trust Bank</div>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="lucide:asterisk" class="w-6 h-6"></Icon>
          <div>
            <div class="font-medium">Account Number</div>
            <div class="text-gray-500">0230787884</div>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="lucide:building" class="w-6 h-6"></Icon>
          <div>
            <div class="font-medium">Account Name</div>
            <div class="text-gray-500">ANNADAA Educational Foundation</div>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="lucide:badge-check" class="w-6 h-6"></Icon>
          <div>
            <div class="font-medium">SWIFT Code</div>
            <div class="text-gray-500">GTBINGLA XXX</div>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="lucide:circle-check" class="w-6 h-6"></Icon>
          <div>
            <div class="font-medium">Sort Code</div>
            <div class="text-gray-500">058118119</div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-6 rounded-xl outline outline-1 outline-gray-300">
      <div class="grid w-full lg:flex gap-y-4 gap-x-12">
        <div class="w-full">
          <h4 class="font-normal">Malaysian Ringgit Account</h4>
          <p class="font-light text-dark-gray">
            You can transfer funds directly to our bank account in Malaysia
            (MYR).
          </p>
        </div>
        <Button @click="copyMalaysiaAccount" :variant="'white'">
          <template v-if="copyClicked.malaysia">
            <Icon name="lucide:check" class="mr-2" />
            Copied
          </template>
          <template v-else>
            <Icon name="lucide:copy" class="mr-2" /> Copy
          </template>
        </Button>
      </div>

      <div class="w-full pt-4 space-y-4 text-gray-700">
        <div class="flex items-start space-x-4">
          <Icon name="lucide:banknote" class="w-6 h-6"></Icon>
          <div>
            <div class="font-medium">Bank Name</div>
            <div class="text-gray-500">Maybank</div>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="lucide:asterisk" class="w-6 h-6"></Icon>
          <div>
            <div class="font-medium">Account Number</div>
            <div class="text-gray-500">562263544473</div>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="lucide:building" class="w-6 h-6"></Icon>
          <div>
            <div class="font-medium">Account Name</div>
            <div class="text-gray-500">Pertubuhan An-Nadaa Malaysia</div>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="lucide:badge-check" class="w-6 h-6"></Icon>
          <div>
            <div class="font-medium">SWIFT Code</div>
            <div class="text-gray-500">MBBEMYKL</div>
          </div>
        </div>

        <p class="font-light">
          For any inquiries or further information
          <NuxtLink class="underline text-primary" to="/contact"
            >contact us</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const copyClicked = ref({
  nigeria: false,
  malaysia: false,
})

function copyNigeriaAccount() {
  const nigeriaAccount = `Bank Name: Guaranty Trust Bank
Account Number: 0230787884
Account Name: ANNADAA Educational Foundation
SWIFT Code: GTBINGLA XXX
Sort Code: 058118119`
  navigator.clipboard.writeText(nigeriaAccount)

  copyClicked.value.nigeria = true
  setTimeout(() => {
    copyClicked.value.nigeria = false
  }, 2000)
}

function copyMalaysiaAccount() {
  const malaysiaAccount = `Bank Name: Maybank
Account Number: 562263544473
Account Name: Pertubuhan An-Nadaa Malaysia
SWIFT Code: MBBEMYKL`
  navigator.clipboard.writeText(malaysiaAccount)

  copyClicked.value.malaysia = true
  setTimeout(() => {
    copyClicked.value.malaysia = false
  }, 2000)
}
</script>
