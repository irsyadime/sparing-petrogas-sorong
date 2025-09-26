<template>
  <div class="w-100" :style="{ height: height }">
    <Line ref="chartRef" :data="props.chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  height: {
    type: String,
    default: '150px',
  },
    yMin: {
    type: Number,
    default: undefined, // Only apply if provided
  },
  yMax: {
    type: Number,
    default: undefined,
  },
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#00000',
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.2)',
      },
    },
    y: {
      min: props.yMin ?? undefined,
      max: props.yMax ?? undefined,
      ticks: {
        color: '#00000',
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
}
</script>

<style></style>
