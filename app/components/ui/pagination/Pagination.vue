<script setup lang="ts">
import { computed } from "vue"
import { cn } from "~/lib/utils"

interface Props {
  total?: number
  itemsPerPage?: number
  currentPage?: number
  defaultPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  total: 0,
  itemsPerPage: 10,
  currentPage: 1,
  defaultPage: 1,
})

const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage))
const page = computed(() => props.currentPage || props.defaultPage)

const emit = defineEmits<{
  "update:currentPage": [page: number]
}>()

function goToPage(newPage: number) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    emit("update:currentPage", newPage)
  }
}

function previousPage() {
  if (page.value > 1) {
    goToPage(page.value - 1)
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    goToPage(page.value + 1)
  }
}

const canPrevious = computed(() => page.value > 1)
const canNext = computed(() => page.value < totalPages.value)

defineExpose({
  page,
  totalPages,
  goToPage,
  previousPage,
  nextPage,
  canPrevious,
  canNext,
})
</script>

<template>
  <nav
    role="navigation"
    aria-label="pagination"
    :class="cn('mx-auto flex w-full justify-center', $attrs.class)"
  >
    <slot
      :page="page"
      :total-pages="totalPages"
      :can-previous="canPrevious"
      :can-next="canNext"
      :go-to-page="goToPage"
      :previous-page="previousPage"
      :next-page="nextPage"
    />
  </nav>
</template>

