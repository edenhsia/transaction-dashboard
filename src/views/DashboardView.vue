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

    <ErrorMessage v-if="isError" message="無法取得統計資料，請稍後再試。" />

    <template v-else>
      <OperationalInsights v-if="data" :items="data.insights" />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <template v-if="isPending">
          <KpiSkeletonCard v-for="i in 4" :key="i" />
        </template>

        <template v-else>
          <KpiCard
            v-for="item in summaryItems"
            :key="item.label"
            v-bind="item"
            :comparison-days="days"
          />
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
  import { formatMoney } from '@/utils'

  type ComparisonDirection = 'up' | 'down' | 'neutral'
  type ComparisonTone = 'positive' | 'negative' | 'neutral'

  type SummaryItem = {
    label: string
    value: string
    description: string
    icon: string
    comparison: string
    comparisonDirection: ComparisonDirection
    comparisonTone: ComparisonTone
  }

  const days = ref<DashboardDays>(7)

  const { data, isPending, isError } = useDashboard(days)

  const numberFormatter = new Intl.NumberFormat('zh-TW')

  function getDirection(value: number | null): ComparisonDirection {
    if (value === null || value === 0) return 'neutral'
    return value > 0 ? 'up' : 'down'
  }

  function getTone(value: number | null): ComparisonTone {
    if (value === null || value === 0) return 'neutral'
    return value > 0 ? 'positive' : 'negative'
  }

  function formatChangeRate(value: number | null) {
    if (value === null) return '前期無資料'
    if (value === 0) return '持平'

    return `${Math.abs(value).toFixed(1)}%`
  }

  function formatChangePoints(value: number) {
    if (value === 0) return '持平'

    return `${Math.abs(value).toFixed(1)} 個百分點`
  }

  const summaryItems = computed<SummaryItem[]>(function () {
    const summary = data.value?.summary
    const comparison = data.value?.comparison

    if (!summary || !comparison) return []

    return [
      {
        label: '成功交易總額',
        value: formatMoney(summary.totalAmount),
        description: '成功交易金額加總',
        icon: 'pi pi-wallet',
        comparison: formatChangeRate(comparison.totalAmountChangeRate),
        comparisonDirection: getDirection(comparison.totalAmountChangeRate),
        comparisonTone: getTone(comparison.totalAmountChangeRate),
      },
      {
        label: '總交易筆數',
        value: numberFormatter.format(summary.totalTransactions),
        description: '包含所有交易狀態',
        icon: 'pi pi-receipt',
        comparison: formatChangeRate(comparison.totalTransactionsChangeRate),
        comparisonDirection: getDirection(comparison.totalTransactionsChangeRate),
        comparisonTone: getTone(comparison.totalTransactionsChangeRate),
      },
      {
        label: '交易成功率',
        value: `${summary.successRate.toFixed(2)}%`,
        description: '成功交易筆數占比',
        icon: 'pi pi-check-circle',
        comparison: formatChangePoints(comparison.successRateChangePoints),
        comparisonDirection: getDirection(comparison.successRateChangePoints),
        comparisonTone: getTone(comparison.successRateChangePoints),
      },
      {
        label: '平均交易金額',
        value: formatMoney(summary.averageAmount),
        description: '每筆成功交易平均金額',
        icon: 'pi pi-chart-line',
        comparison: formatChangeRate(comparison.averageAmountChangeRate),
        comparisonDirection: getDirection(comparison.averageAmountChangeRate),
        comparisonTone: getTone(comparison.averageAmountChangeRate),
      },
    ]
  })
</script>
