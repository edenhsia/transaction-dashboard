<template>
  <PrimeCard class="h-full shadow-none">
    <template #title>
      <h2 class="text-lg font-medium">各分店交易金額</h2>
    </template>

    <template #subtitle>依成功交易金額比較各分店表現</template>

    <template #content>
      <PrimeChart type="bar" :data="chartData" :options="chartOptions" class="h-full w-full" />
    </template>
  </PrimeCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { ChartData, ChartOptions } from 'chart.js'

  type BranchComparison = {
    mid: string
    name: string
    amount: number
  }

  const props = defineProps<{
    data: BranchComparison[]
  }>()

  const documentStyle = getComputedStyle(document.documentElement)

  const currencyFormatter = new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  })

  const chartData = computed<ChartData<'bar'>>(function () {
    return {
      labels: props.data.map(function (item) {
        return item.name
      }),
      datasets: [
        {
          label: '成功交易金額',
          data: props.data.map(function (item) {
            return item.amount
          }),
          backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
          borderRadius: 4,
          barThickness: 16,
        },
      ],
    }
  })

  const chartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return currencyFormatter.format(context.parsed.x ?? 0)
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat('en', {
              notation: 'compact',
              maximumFractionDigits: 0,
            }).format(Number(value))
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  }
</script>
