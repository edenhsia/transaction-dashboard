<template>
  <PrimeCard class="shadow-none">
    <template #title>
      <h2 class="text-lg font-medium">交易狀態分布</h2>
    </template>

    <template #subtitle>依交易狀態統計交易筆數</template>

    <template #content>
      <PrimeChart type="doughnut" :data="chartData" :options="chartOptions" class="w-full" />
    </template>
  </PrimeCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { ChartData, ChartOptions } from 'chart.js'

  type TransactionStatus = 'success' | 'failed' | 'pending'

  type StatusDistribution = {
    status: TransactionStatus
    count: number
  }

  const props = defineProps<{
    data: StatusDistribution[]
  }>()

  const documentStyle = getComputedStyle(document.documentElement)

  const statusConfig: Record<TransactionStatus, { label: string; color: string }> = {
    success: { label: '成功', color: documentStyle.getPropertyValue('--p-primary-500') },
    failed: { label: '失敗', color: documentStyle.getPropertyValue('--p-red-400') },
    pending: { label: '處理中', color: documentStyle.getPropertyValue('--p-amber-400') },
  }

  const chartData = computed<ChartData<'doughnut'>>(function () {
    return {
      labels: props.data.map(function (item) {
        return statusConfig[item.status].label
      }),
      datasets: [
        {
          data: props.data.map(function (item) {
            return item.count
          }),
          backgroundColor: props.data.map(function (item) {
            return statusConfig[item.status].color
          }),
        },
      ],
    }
  })

  const numberFormatter = new Intl.NumberFormat('zh-TW')

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}：${numberFormatter.format(context.parsed)} 筆`
          },
        },
      },
    },
  }
</script>
