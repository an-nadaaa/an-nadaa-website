<script setup lang="ts">
import { computed, ref, onUpdated, nextTick } from "vue"
import {
  VisXYContainer,
  VisLine,
  VisArea,
  VisAxis,
  VisTooltip,
  VisCrosshair,
} from "@unovis/vue"
import { CurveType } from "@unovis/ts"
import { useMoneyFormat } from "@/composables/useMoneyFormat"

export type DonationEntry = {
  amount: number
  currency: string
  conversionRate?: number
  amountUSD?: number
}

export type DonationsChartProp = Record<string, DonationEntry>

const props = withDefaults(
  defineProps<{
    donations?: DonationsChartProp
    exchangeRates?: Record<string, number>
  }>(),
  {
    donations: () => ({}),
    exchangeRates: () => ({}),
  }
)

const { formatCurrency } = useMoneyFormat()

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]
const FULL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function toDateKey(isoKey: string): string {
  const iso = isoKey.includes("_") ? isoKey.slice(0, isoKey.indexOf("_")) : isoKey
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return isoKey
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function toUSD(entry: DonationEntry): number {
  const { amount, currency, conversionRate, amountUSD } = entry
  if (typeof amountUSD === "number") return amountUSD
  const c = (currency || "").toUpperCase()
  if (typeof conversionRate === "number") return amount * conversionRate
  if (c === "USD") return amount
  const rate = props.exchangeRates[c]
  if (typeof rate === "number") return amount * rate
  return amount
}

type ChartPoint = {
  x: number
  y: number
  date: string
  dateLabel: string
  isMonthStart: boolean
  monthIndex: number
  dayOfMonth: number
}

const chartData = computed<ChartPoint[]>(() => {
  const donations = props.donations
  if (!donations || Object.keys(donations).length === 0) return []

  const byDate = new Map<string, number>()
  for (const [iso, entry] of Object.entries(donations)) {
    const key = toDateKey(iso)
    const usd = toUSD(entry)
    byDate.set(key, (byDate.get(key) ?? 0) + usd)
  }

  const dates = Array.from(byDate.keys()).sort()
  if (dates.length === 0) return []

  const [first, last] = [dates[0], dates[dates.length - 1]]
  if (!first || !last) return []

  const start = new Date(first + "T00:00:00Z")
  const end = new Date(last + "T00:00:00Z")
  const points: ChartPoint[] = []
  const current = new Date(start)

  while (current <= end) {
    const y = current.getUTCFullYear()
    const m = current.getUTCMonth()
    const d = current.getUTCDate()
    const dateKey = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    const amount = byDate.get(dateKey) ?? 0
    const isMonthStart = d === 1
    points.push({
      x: points.length,
      y: Math.round(amount * 100) / 100,
      date: dateKey,
      dateLabel: `${FULL_MONTHS[m]} ${d}, ${y}`,
      isMonthStart,
      monthIndex: m,
      dayOfMonth: d,
    })
    current.setUTCDate(current.getUTCDate() + 1)
  }

  return points
})

const daysSpan = computed(() => {
  const data = chartData.value
  if (data.length <= 1) return 0
  const first = data[0]
  const last = data[data.length - 1]
  if (!first || !last) return 0
  const a = new Date(first.date + "T00:00:00Z").getTime()
  const b = new Date(last.date + "T00:00:00Z").getTime()
  return Math.round((b - a) / (24 * 60 * 60 * 1000))
})

const useDateTicks = computed(() => daysSpan.value <= 31)

const xTickValues = computed(() => {
  const data = chartData.value
  if (data.length === 0) return []
  if (useDateTicks.value) return data.map((_, i) => i)
  return data
    .map((p, i) => (p.isMonthStart ? i : -1))
    .filter((i) => i >= 0)
})

const formatX = (tick: number) => {
  const data = chartData.value
  const point = data[tick]
  if (!point) return ""
  if (useDateTicks.value) return point.isMonthStart ? MONTHS[point.monthIndex] : String(point.dayOfMonth)
  return MONTHS[point.monthIndex]
}

const x = (d: ChartPoint) => d.x
const y = (d: ChartPoint) => d.y

const svgDefs = `
  <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0%" stop-color="#149ec7" stop-opacity="0.35" />
    <stop offset="100%" stop-color="#149ec7" stop-opacity="0" />
  </linearGradient>
`

const crosshairTemplate = (d: ChartPoint) => {
  const value = formatCurrency(d.y, "USD")
  return `
  <div style="display: flex; align-items: center; gap: 8px; min-width: 120px;">
    <span style="color: #60a5fa;">●</span>
    <span style="color: #e5e7eb;">${d.dateLabel}</span>
    <span style="margin-left: auto; font-weight: bold; font-size: 1.1em;">${value}</span>
  </div>
  `
}

const crosshairColor = () => "#149ec7"

const chartContainerRef = ref<HTMLElement | null>(null)

function markMonthTicks() {
  nextTick(() => {
    const el = chartContainerRef.value
    if (!el) return
    const ticks = el.querySelectorAll(".tick")
    ticks.forEach((g) => {
      const text = g.querySelector("text")
      const content = text?.textContent?.trim() ?? ""
      if (MONTHS.includes(content)) {
        g.classList.add("month-tick")
      } else {
        g.classList.remove("month-tick")
      }
    })
  })
}

onUpdated(markMonthTicks)
</script>

<template>
  <div ref="chartContainerRef" class="donations-chart">
    <div
      v-if="chartData.length === 0"
      class="chart-empty"
    >
      No donation data to display
    </div>
    <VisXYContainer
      v-else
      :data="chartData"
      :scale-by-domain="true"
      :height="300"
      :svg-defs="svgDefs"
    >
      <VisArea
        :x="x"
        :y="y"
        color="url(#areaGradient)"
        :curve-type="CurveType.CatmullRom"
        :line="false"
      />
      <VisLine
        :x="x"
        :y="y"
        color="#149ec7"
        :curve-type="CurveType.CatmullRom"
        :stroke-width="3"
      />
      <VisAxis
        type="x"
        :tick-format="formatX"
        :tick-values="xTickValues"
        :grid-line="false"
        :domain-line="false"
      />
      <VisAxis
        type="y"
        :tick-format="() => ''"
        :num-ticks="5"
        :domain-line="false"
        :tick-line="false"
        :grid-line="true"
      />
      <VisTooltip />
      <VisCrosshair
        :template="crosshairTemplate"
        :color="crosshairColor"
      />
    </VisXYContainer>
  </div>
</template>

<style scoped>
.donations-chart {
  --vis-axis-grid-color: #e5e7eb;
  --vis-axis-tick-color: #9ca3af;
  --vis-tooltip-background-color: #1f2937;
  --vis-tooltip-text-color: #fff;
  --vis-tooltip-padding: 8px 12px;
  --vis-tooltip-border-radius: 6px;
  --vis-axis-tick-label-font-size: 12px;
  --vis-axis-tick-label-color: #515356;
  --vis-axis-tick-label-weight: 200;
  --vis-axis-font-family: "Inter", sans-serif;
  font-family: sans-serif;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #6b7280;
  font-size: 14px;
}

/* Default tick label */
:deep(.donations-chart .tick text) {
  font-size: 12px;
  font-weight: 200;
}

/* Larger and bolder for month labels (Jan, Feb, ...) applied via .month-tick class */
:deep(.donations-chart .tick.month-tick text) {
  font-size: 13px;
  font-weight: 600;
}
</style>
