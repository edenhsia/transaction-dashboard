<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-2">
      <p class="text-muted-color text-sm">掌握各特店的交易概況與金流數據</p>

      <div class="flex flex-wrap items-center gap-2">
        <PrimeTag value="DEMO" severity="secondary" />

        <p class="text-muted-color text-xs">模擬交易資料・基準日 2026/10/27</p>
      </div>
    </div>

    <PeriodSelector v-model="days" />

    <PrimeDivider />

    <PrimeMessage v-if="isError" severity="error" :closable="false">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span>無法取得統計資料，請稍後再試。</span>

        <PrimeButton
          label="重新取得"
          icon="pi pi-refresh"
          size="small"
          severity="secondary"
          outlined
          @click="reloadPage"
        />
      </div>
    </PrimeMessage>

    <template v-else>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <template v-if="isPending">
          <KpiSkeletonCard v-for="i in 4" :key="i" />
        </template>

        <template v-else>
          <KpiCard v-for="item in summaryItems" :key="item.label" v-bind="item" />
        </template>
      </div>

      <template v-if="data">
        <TransactionTrendChart :data="data.dailyTrend" />

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TransactionStatusChart :data="data.statusDistribution" />
          <BranchComparisonChart :data="data.branchComparison" />
        </div>
      </template>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { type DashboardDays } from '@/services/dashboard'
  import { useDashboard } from '@/composables/useDashboard'
  import { formatMoney, reloadPage } from '@/utils'

  const days = ref<DashboardDays>(7)

  const { data, isPending, isError } = useDashboard(days)

  const numberFormatter = new Intl.NumberFormat('zh-TW')

  const summaryItems = computed(function () {
    const summary = data.value?.summary

    if (!summary) return []

    return [
      {
        label: '成功交易總額',
        value: formatMoney(summary.totalAmount),
        description: '成功交易金額加總',
        icon: 'pi pi-wallet',
      },
      {
        label: '總交易筆數',
        value: numberFormatter.format(summary.totalTransactions),
        description: '包含所有交易狀態',
        icon: 'pi pi-receipt',
      },
      {
        label: '交易成功率',
        value: `${summary.successRate.toFixed(2)}%`,
        description: '成功交易筆數占比',
        icon: 'pi pi-check-circle',
      },
      {
        label: '平均交易金額',
        value: formatMoney(summary.averageAmount),
        description: '每筆成功交易平均金額',
        icon: 'pi pi-chart-line',
      },
    ]
  })
</script>
