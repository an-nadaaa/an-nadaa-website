<script setup lang="ts">
import {
  VisXYContainer,
  VisLine,
  VisArea,
  VisAxis,
  VisTooltip,
  VisScatter,
} from "@unovis/vue"
import { CurveType, Scatter, Line } from "@unovis/ts"

type XYDataRecord = {
  x: number
  y: number
}

// 1. Expanded data to match the "Jan - Dec" timeline in the image
// const data: XYDataRecord[] = [
//   { x: 0, y: 350 },
//   { x: 1, y: 380 },
//   { x: 2, y: 360 },
//   { x: 3, y: 400 },
//   { x: 4, y: 450 },
//   { x: 5, y: 470 },
//   { x: 6, y: 440 },
//   { x: 7, y: 480 },
//   { x: 8, y: 500 },
//   { x: 9, y: 490 },
//   { x: 10, y: 550 },
//   { x: 11, y: 600 },
// ]
const data: XYDataRecord[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
  { x: 4, y: 0 },
  { x: 5, y: 100 }, // The only non-zero value
  { x: 6, y: 0 },
  { x: 7, y: 0 },
  { x: 8, y: 0 },
  { x: 9, y: 0 },
  { x: 10, y: 0 },
  { x: 11, y: 0 },
]

// Accessors
const x = (d: XYDataRecord) => d.x
const y = (d: XYDataRecord) => d.y

// 2. Formatters for the Axis labels and Tooltip
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]
const formatX = (tick: number) => months[tick]

// Show all 12 months on the x-axis
const xTickValues = months.map((_, i) => i)

// Gradient for area fill: full height of chart, only visible below the line
const svgDefs = `
  <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0%" stop-color="#149ec7" stop-opacity="0.35" />
    <stop offset="100%" stop-color="#149ec7" stop-opacity="0" />
  </linearGradient>
`

// 3. Tooltip Template
// This HTML string builds the specific "March $900" look from your screenshot
// const tooltipTemplate = (d: XYDataRecord) => {
//   return `
//     <div style="display: flex; align-items: center; gap: 8px; min-width: 120px;">
//       <span style="color: #60a5fa;">●</span>
//       <span style="color: #e5e7eb;">${months[d.x]}</span>
//       <span style="margin-left: auto; font-weight: bold; font-size: 1.1em;">$${d.y}</span>
//     </div>
//   `
// }
</script>

<template>
  <div class="chart-container">
    <VisXYContainer :data="data" :scaleByDomain="true" :height="300" :svg-defs="svgDefs">
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

      <!-- <VisScatter
        :x="x"
        :y="y"
        :size="8"
        color="#3b82f6"
        stroke-color="#fff"
        :stroke-width="2"
      /> -->

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
        :numTicks="5"
        :domain-line="false"
        :tick-line="false"
        :grid-line="true"
        />
        <!-- :grid-line="true" -->

      <VisTooltip
        :triggers="{
          [Scatter.selectors.point]: tooltipTemplate,
          [Line.selectors.line]: tooltipTemplate,
        }"
      />
    </VisXYContainer>
  </div>
</template>

<style scoped>
/* Custom styling to match the grid/axis look */
.chart-container {
  /* Using CSS variables to control unovis internal styles */
  --vis-axis-grid-color: #e5e7eb;
  --vis-axis-tick-color: #9ca3af;
  --vis-tooltip-background-color: #1f2937; /* Dark background for tooltip */
  --vis-tooltip-text-color: #fff;
  --vis-tooltip-padding: 8px 12px;
  --vis-tooltip-border-radius: 6px;

  --vis-axis-tick-label-font-size: 4px;
  --vis-axis-tick-label-color: #515356;
  --vis-axis-tick-label-weight: 200;
  --vis-axis-font-family: "Inter", sans-serif;

  /* Possible values for the axis */
  /* --vis-axis-tick-color: #e8e9ef;
  --vis-axis-grid-color: #e8e9ef;
  --vis-axis-grid-line-width: 1px;
  --vis-axis-grid-line-dasharray: none;
  --vis-axis-label-font-size: 14px;
  --vis-axis-label-color: #6c778c;
  --vis-axis-label-weight: 500;
  --vis-axis-tick-label-color: #6c778c;
  --vis-axis-tick-label-font-size: 12px;
  --vis-axis-tick-label-weight: 500;
  --vis-axis-tick-label-cursor: default;
  --vis-axis-tick-label-text-decoration: none;
  --vis-axis-tick-line-width: 1px;
  --vis-axis-tick-label-hide-transition: opacity 400ms ease-in-out;
  --vis-dark-axis-tick-color: #6c778c;
  --vis-dark-axis-tick-label-color: #e8e9ef;
  --vis-dark-axis-grid-color: #6c778c;
  --vis-dark-axis-label-color: #fefefe; */

  font-family: sans-serif;
}

/* Optional: Make the Y-axis grid lines dashed */
/* :deep(.unovis-axis-grid) {
  stroke-dasharray: 4, 4;
} */
</style>
