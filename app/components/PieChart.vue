<script setup lang="ts">
import { Donut } from "@unovis/ts"
import { VisDonut, VisSingleContainer, VisTooltip } from "@unovis/vue"
import { computed, createApp } from "vue"
import { ChartTooltip } from "@/components/ui/chart"

export interface DonationData {
  totalDonations: number
  totalAmountUSD: number
  totalAmountMYR: number
  byCategory: Array<{
    categoryId: number
    categoryDocumentId: string
    categoryTitle: string
    totalAmountUSD: number
    totalAmountMYR: number
    donationCount: number
  }>
  byCountry: Array<{
    countryCode: string
    countryName: string
    totalAmountUSD: number
    totalAmountMYR: number
    donationCount: number
  }>
}

interface Props {
  data: DonationData
  groupBy?: "category" | "country"
}

const props = withDefaults(defineProps<Props>(), {
  groupBy: "category",
})

// Color palette matching the screenshot (shades of blue/teal)
const colorPalette = [
  "#0E7490", // dark teal
  "#0891B2", // teal
  "#06B6D4", // cyan
  "#22D3EE", // light cyan
  "#A5F3FC", // very light cyan
  "#E5E7EB", // gray for "Other"
]

interface ChartDataItem {
  name: string
  amount: number
  donationCount: number
  color: string
}

// Transform and limit data to top 4 + others
const chartData = computed<ChartDataItem[]>(() => {
  const sourceData =
    props.groupBy === "category"
      ? props.data.byCategory.map((item) => ({
          name: item.categoryTitle,
          amount: item.totalAmountUSD,
          donationCount: item.donationCount,
        }))
      : props.data.byCountry.map((item) => ({
          name: item.countryName,
          amount: item.totalAmountUSD,
          donationCount: item.donationCount,
        }))

  // Sort by amount descending
  const sorted = [...sourceData].sort((a, b) => b.amount - a.amount)

  // Take top 4
  const top4 = sorted.slice(0, 4)
  const remaining = sorted.slice(4)

  // Create chart data with colors
  const result: ChartDataItem[] = top4.map((item, index) => ({
    ...item,
    color: colorPalette[index] as string,
  }))

  // Add "Other" if there are remaining items
  if (remaining.length > 0) {
    const otherTotal = remaining.reduce((sum, item) => sum + item.amount, 0)
    const otherCount = remaining.reduce(
      (sum, item) => sum + item.donationCount,
      0
    )
    result.push({
      name: "Other",
      amount: otherTotal,
      donationCount: otherCount,
      color: colorPalette[5] as string,
    })
  }

  return result
})

const totalDonations = computed(() => props.data.totalDonations)

// Tooltip template
const tooltipWm = new WeakMap()
const donutTooltipTemplate = (
  d: any,
  i: number,
  elements: (HTMLElement | SVGElement)[]
) => {
  if (tooltipWm.has(d)) {
    return tooltipWm.get(d)
  }

  const data = d.data || d
  const name = data.name || ""
  const amount = data.amount || 0
  const element = elements[i]
  const color = element
    ? getComputedStyle(element).fill || data.color || "#000"
    : data.color || "#000"

  if (typeof document !== "undefined") {
    const componentDiv = document.createElement("div")
    createApp(ChartTooltip, {
      title: name,
      data: [
        {
          name: "Amount",
          value: `$${amount.toLocaleString()}`,
          color: color,
        },
      ],
    }).mount(componentDiv)
    const html = componentDiv.innerHTML
    tooltipWm.set(d, html)
    return html
  }

  return ""
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <div
      class="mx-auto aspect-square max-h-[250px]"
      :style="{
        '--vis-donut-central-label-font-size': 'var(--text-3xl)',
        '--vis-donut-central-label-font-weight': 'var(--font-weight-bold)',
        '--vis-donut-central-label-text-color': 'var(--foreground)',
        '--vis-donut-central-sub-label-text-color': 'var(--muted-foreground)',
        '--vis-donut-central-sub-label-font-weight': 'var(--font-weight-light)',
      }"
    >
      <VisSingleContainer :data="chartData" :margin="{ top: 30, bottom: 30 }">
        <VisDonut
          :value="(d: ChartDataItem) => d.amount"
          :color="(d: ChartDataItem) => d.color"
          :arc-width="30"
          :central-label-offset-y="10"
          :central-label="totalDonations.toLocaleString()"
          central-sub-label="Donations"
        />
        <VisTooltip
          class="absolute top-0 left-0"
          :horizontal-shift="100"
          :vertical-shift="1000"
          :triggers="{
            [Donut.selectors.segment]: donutTooltipTemplate,
          }"
        />
      </VisSingleContainer>
    </div>

    <!-- Legend -->
    <div
      class="flex flex-wrap gap-y-2 gap-x-4 justify-center items-center mt-4"
    >
      <div
        v-for="item in chartData"
        :key="item.name"
        class="flex gap-2 items-center"
      >
        <div
          class="w-2.5 h-2.5 rounded-full"
          :style="{ backgroundColor: item.color }"
        />
        <span class="text-sm text-muted-foreground">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>
