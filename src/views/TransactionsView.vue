<template>
  <section class="space-y-6">
    <TransactionFilters @search="handleSearch" />

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

  const page = ref(1)
  const pageSize = 10

  const filters = ref<TransactionFilterValues>({
    id: '',
    mid: null,
    status: null,
    startDate: '',
    endDate: '',
  })

  const query = computed<TransactionQuery>(function () {
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
    page.value = 1
    filters.value = values
  }

  function handlePage(value: number) {
    page.value = value
  }
</script>
