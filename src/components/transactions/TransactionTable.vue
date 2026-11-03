<template>
  <PrimeCard>
    <template #title>
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-lg font-medium">交易紀錄</h2>

        <span class="text-muted-color text-sm"> 共 {{ numberFormatter.format(total) }} 筆 </span>
      </div>
    </template>

    <template #content>
      <PrimeDataTable
        :value="data"
        data-key="id"
        lazy
        paginator
        :first="(page - 1) * pageSize"
        :rows="pageSize"
        :total-records="total"
        :loading="loading"
        :always-show-paginator="false"
        paginator-template="PrevPageLink PageLinks NextPageLink"
        class="w-full"
        @page="handlePage"
      >
        <template #empty>沒有符合條件的交易紀錄</template>

        <PrimeColumn field="createdAt" header="交易時間">
          <template #body="{ data: item }">
            {{ formatDateTime(item.createdAt) }}
          </template>
        </PrimeColumn>

        <PrimeColumn field="id" header="交易編號" />

        <PrimeColumn header="分店">
          <template #body="{ data: item }">
            {{ branchMap[item.mid] ?? '—' }}
          </template>
        </PrimeColumn>

        <PrimeColumn header="交易金額" header-class="text-right">
          <template #body="{ data: item }">
            <div class="text-right font-medium">
              {{ formatMoney(item.amount) }}
            </div>
          </template>
        </PrimeColumn>

        <PrimeColumn header="交易狀態">
          <template #body="{ data: item }">
            <PrimeTag
              :value="getStatusConfig(item.status).label"
              :severity="getStatusConfig(item.status).severity"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn header="操作">
          <template #body="{ data: item }">
            <PrimeButton
              label="詳情"
              icon="pi pi-chevron-circle-right"
              size="small"
              severity="secondary"
              icon-pos="right"
              text
              @click="goToDetail(item.id)"
            />
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </template>
  </PrimeCard>
</template>

<script setup lang="ts">
  import branches from '@/data/branches.json'
  import type { Transaction, TransactionStatus, PaymentMethod } from '@/services/transactions'
  import { formatMoney } from '@/utils'

  defineProps<{
    data: Transaction[]
    total: number
    page: number
    pageSize: number
    loading: boolean
  }>()

  const emit = defineEmits<{
    page: [page: number]
  }>()

  const branchMap: Record<string, string> = Object.fromEntries(
    branches.map(function (branch) {
      return [branch.mid, branch.name]
    }),
  )

  const statusConfig: Record<
    TransactionStatus,
    { label: string; severity: 'success' | 'danger' | 'warn' }
  > = {
    success: { label: '成功', severity: 'success' },
    failed: { label: '失敗', severity: 'danger' },
    pending: { label: '處理中', severity: 'warn' },
  }

  const numberFormatter = new Intl.NumberFormat('zh-TW')

  function formatDateTime(value: string) {
    return value.replace('T', ' ').slice(0, 16)
  }

  function getStatusConfig(status: TransactionStatus) {
    return statusConfig[status]
  }

  function handlePage(event: { page: number }) {
    emit('page', event.page + 1)
  }

  const router = useRouter()
  const route = useRoute()

  function goToDetail(id: string) {
    router.push({
      name: 'transaction-detail',
      params: { id },
      query: route.query,
    })
  }
</script>
