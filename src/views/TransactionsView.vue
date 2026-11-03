<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center gap-2">
      <PrimeTag value="DEMO" severity="secondary" />

      <p class="text-muted-color text-xs">模擬交易資料・基準日 2026/10/27</p>
    </div>

    <TransactionFilters :initial-filters="filters" @search="handleSearch" />

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

    <TransactionTable
      v-else
      :data="data?.data ?? []"
      :total="data?.pagination.total ?? 0"
      :page="page"
      :page-size="pageSize"
      :loading="isPending || isFetching"
      @page="handlePage"
    />
  </section>
</template>

<script setup lang="ts">
  import type { TransactionFilterValues } from '@/components/transactions/TransactionFilters.vue'
  import type { TransactionQuery } from '@/services/transactions'
  import { useTransactions } from '@/composables/useTransactions'
  import { reloadPage } from '@/utils'

  const router = useRouter()
  const route = useRoute()
  const pageSize = 10

  function getQueryString(value: unknown): string {
    return typeof value === 'string' ? value : ''
  }

  const filters = computed<TransactionFilterValues>(() => {
    return {
      id: getQueryString(route.query.id),
      mid: getQueryString(route.query.mid) || null,
      status: getQueryString(route.query.status) || null,
      startDate: getQueryString(route.query.startDate),
      endDate: getQueryString(route.query.endDate),
    }
  })

  const page = computed(() => {
    const value = Number(route.query.page)

    return Number.isSafeInteger(value) && value > 0 ? value : 1
  })

  const query = computed<TransactionQuery>(() => {
    return {
      page: page.value,
      pageSize,
      id: filters.value.id,
      mid: filters.value.mid ?? undefined,
      status: filters.value.status ?? undefined,
      startDate: filters.value.startDate,
      endDate: filters.value.endDate,
    }
  })

  const { data, isPending, isFetching, isError } = useTransactions(query)

  function handleSearch(values: TransactionFilterValues) {
    router.push({
      query: {
        id: values.id || undefined,
        mid: values.mid || undefined,
        status: values.status || undefined,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
      },
    })
  }

  function handlePage(value: number) {
    router.push({
      query: {
        ...route.query,
        page: value === 1 ? undefined : String(value),
      },
    })
  }
</script>
