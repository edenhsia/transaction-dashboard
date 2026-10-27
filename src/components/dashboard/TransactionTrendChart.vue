<template>
  <PrimeCard class="shadow-none">
    <template #title>
      <h2 class="text-lg font-medium">每日成功交易金額</h2>
    </template>

    <template #subtitle>依交易日期統計成功交易金額</template>

    <template #content>
      <PrimeChart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
    </template>
  </PrimeCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { ChartData, ChartOptions } from 'chart.js'

  type DailyTrend = {
    date: string
    amount: number
  }

  const props = defineProps<{
    data: DailyTrend[]
  }>()

  const documentStyle = getComputedStyle(document.documentElement)
  const chartData = computed<ChartData<'line'>>(function () {
    return {
      labels: props.data.map(function (item) {
        return item.date.slice(5).replace('-', '/')
      }),
      datasets: [
        {
          label: '成功交易金額',
          data: props.data.map(function (item) {
            return item.amount
          }),
          borderColor: documentStyle.getPropertyValue('--p-primary-500'),
          borderWidth: 2,
          tension: 0,
          pointHoverRadius: 5,
        },
      ],
    }
  })

  const currencyFormatter = new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  })

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return currencyFormatter.format(context.parsed.y ?? 0)
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 8,
          minRotation: 0,
          maxRotation: 45,
          align: 'inner',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return Number(value).toLocaleString('zh-TW')
          },
        },
      },
    },
  }
</script>
