<script setup lang="ts">
import { computed, ref, onUpdated, nextTick, onMounted, onUnmounted } from "vue"
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

const NARROW_VIEW_MAX_WIDTH = 720

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
    /** When "30days", narrow screens show week-start ticks (e.g. "2 Feb", "9 Feb"). */
    timeframe?: string
  }>(),
  {
    donations: () => ({}),
    exchangeRates: () => ({}),
    timeframe: undefined,
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
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function parseLocalDate(dateKey: string): Date {
  const parts = dateKey.split("-").map(Number)
  const y = parts[0] ?? 0
  const m = (parts[1] ?? 1) - 1
  const d = parts[2] ?? 1
  return new Date(y, m, d)
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
  isWeekStart: boolean
  monthIndex: number
  dayOfMonth: number
}

const aggregation = computed(() => {
  const donations = props.donations
  const byDate = new Map<string, number>()
  if (!donations) return { byDate, first: undefined as string | undefined, last: undefined as string | undefined }
  for (const [iso, entry] of Object.entries(donations)) {
    const key = toDateKey(iso)
    const usd = toUSD(entry)
    byDate.set(key, (byDate.get(key) ?? 0) + usd)
  }
  const dates = Array.from(byDate.keys()).sort()
  const first = dates[0]
  const last = dates[dates.length - 1]
  return { byDate, first, last }
})

const monthsSpan = computed(() => {
  const { first, last } = aggregation.value
  if (!first || !last) return 0
  const start = parseLocalDate(first)
  const end = parseLocalDate(last)
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1
  )
})

const useMonthlyAggregation = computed(() => monthsSpan.value >= 3)

const chartData = computed<ChartPoint[]>(() => {
  const { byDate, first, last } = aggregation.value
  if (!first || !last) return []

  const start = parseLocalDate(first)
  const end = parseLocalDate(last)

  if (useMonthlyAggregation.value) {
    const byMonth = new Map<string, number>()
    for (const [dateKey, amount] of byDate) {
      const monthKey = dateKey.slice(0, 7)
      byMonth.set(monthKey, (byMonth.get(monthKey) ?? 0) + amount)
    }
    const points: ChartPoint[] = []
    const current = new Date(start.getFullYear(), start.getMonth(), 1)
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1)
    while (current <= endMonth) {
      const y = current.getFullYear()
      const m = current.getMonth()
      const monthKey = `${y}-${String(m + 1).padStart(2, "0")}`
      const amount = byMonth.get(monthKey) ?? 0
      points.push({
        x: points.length,
        y: Math.round(amount * 100) / 100,
        date: `${monthKey}-01`,
        dateLabel: `${FULL_MONTHS[m]} ${y}`,
        isMonthStart: true,
        isWeekStart: false,
        monthIndex: m,
        dayOfMonth: 1,
      })
      current.setMonth(current.getMonth() + 1)
    }
    return points
  }

  const points: ChartPoint[] = []
  const current = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  while (current <= end) {
    const y = current.getFullYear()
    const m = current.getMonth()
    const d = current.getDate()
    const dateKey = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    const amount = byDate.get(dateKey) ?? 0
    const isMonthStart = d === 1
    const isWeekStart = parseLocalDate(dateKey).getDay() === 1
    points.push({
      x: points.length,
      y: Math.round(amount * 100) / 100,
      date: dateKey,
      dateLabel: `${FULL_MONTHS[m]} ${d}, ${y}`,
      isMonthStart,
      isWeekStart,
      monthIndex: m,
      dayOfMonth: d,
    })
    current.setDate(current.getDate() + 1)
  }
  return points
})

const daysSpan = computed(() => {
  const data = chartData.value
  if (data.length <= 1) return 0
  const firstPoint = data[0]
  const lastPoint = data[data.length - 1]
  if (!firstPoint || !lastPoint) return 0
  const a = parseLocalDate(firstPoint.date).getTime()
  const b = parseLocalDate(lastPoint.date).getTime()
  return Math.round((b - a) / (24 * 60 * 60 * 1000))
})

const useDateTicks = computed(() => daysSpan.value <= 31)

const chartContainerRef = ref<HTMLElement | null>(null)
const chartWidth = ref(0)
const isNarrowView = computed(() => chartWidth.value > 0 && chartWidth.value < NARROW_VIEW_MAX_WIDTH)
const useWeekStartTicksOnNarrow = computed(
  () => isNarrowView.value && props.timeframe === "30days"
)

const xTickValues = computed(() => {
  const data = chartData.value
  if (data.length === 0) return []
  if (useMonthlyAggregation.value) return data.map((_, i) => i)
  if (useDateTicks.value) {
    if (isNarrowView.value && props.timeframe === "30days") {
      return data
        .map((p, i) => (p.isWeekStart ? i : -1))
        .filter((i) => i >= 0)
    }
    return data.map((_, i) => i)
  }
  if (isNarrowView.value) {
    const useWeek = props.timeframe === "30days"
    return data
      .map((p, i) => ((useWeek ? p.isWeekStart : p.isMonthStart) ? i : -1))
      .filter((i) => i >= 0)
  }
  return data
    .map((p, i) => (p.isMonthStart ? i : -1))
    .filter((i) => i >= 0)
})

const formatX = (tick: number) => {
  const data = chartData.value
  const point = data[tick]
  if (!point) return ""
  if (useMonthlyAggregation.value) {
    const year = point.date.slice(0, 4)
    const prev = data[tick - 1]
    const prevYear = prev?.date?.slice(0, 4)
    const showYear = !prevYear || prevYear !== year
    return showYear ? `${MONTHS[point.monthIndex]} ${year}` : MONTHS[point.monthIndex]
  }
  if (useWeekStartTicksOnNarrow.value) {
    return `${point.dayOfMonth} ${MONTHS[point.monthIndex]}`
  }
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

let resizeObserver: ResizeObserver | null = null
onMounted(() => {
  const el = chartContainerRef.value
  if (!el) return
  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) chartWidth.value = entry.contentRect.width
  })
  resizeObserver.observe(el)
  chartWidth.value = el.getBoundingClientRect().width
})
onUnmounted(() => {
  if (resizeObserver && chartContainerRef.value) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

function markMonthTicks() {
  nextTick(() => {
    const el = chartContainerRef.value
    if (!el) return
    const ticks = el.querySelectorAll(".tick")
    const isEmphasizedLabel = (content: string) =>
      MONTHS.includes(content) ||
      MONTHS.some((m) => content.endsWith(` ${m}`))
    ticks.forEach((g) => {
      const text = g.querySelector("text")
      const content = text?.textContent?.trim() ?? ""
      if (isEmphasizedLabel(content)) {
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
        :curve-type="CurveType.MonotoneX"
        :line="false"
      />
      <VisLine
        :x="x"
        :y="y"
        color="#149ec7"
        :curve-type="CurveType.MonotoneX"
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
