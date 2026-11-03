<template>
  <section class="space-y-6">
    <RouterLink
      :to="{ path: '/transactions', query: route.query }"
      class="text-muted-color hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
    >
      <i class="pi pi-arrow-left" />
      返回交易列表
    </RouterLink>

    <PrimeMessage v-if="isError" severity="error" :closable="false">
      無法取得交易詳細資料，請稍後再試。
    </PrimeMessage>

    <template v-else-if="isPending">
      <PrimeCard class="shadow-none">
        <template #content>
          <div class="space-y-4">
            <PrimeSkeleton width="12rem" height="2rem" />
            <PrimeSkeleton width="100%" height="1.5rem" />
            <PrimeSkeleton width="70%" height="1.5rem" />
          </div>
        </template>
      </PrimeCard>
    </template>

    <template v-else-if="data">
      <PrimeCard class="shadow-none">
        <template #title>
          <h2 class="text-lg font-medium">交易資訊</h2>
        </template>

        <template #content>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-1">
              <p class="text-muted-color text-sm">交易編號</p>
              <p class="font-medium break-all">{{ data.id }}</p>
            </div>

            <div class="space-y-1">
              <p class="text-muted-color text-sm">交易時間</p>
              <p>{{ formatDateTime(data.createdAt) }}</p>
            </div>

            <div class="space-y-1">
              <p class="text-muted-color text-sm">交易金額</p>
              <p class="text-primary text-2xl font-semibold">
                {{ formatMoney(data.amount) }}
              </p>
            </div>

            <div class="space-y-1">
              <p class="text-muted-color text-sm">交易狀態</p>
              <PrimeTag
                :value="statusConfig[data.status].label"
                :severity="statusConfig[data.status].severity"
              />
            </div>

            <div class="space-y-1">
              <p class="text-muted-color text-sm">付款方式</p>
              <p>{{ paymentLabels[data.paymentMethod] }}</p>
            </div>
          </div>
        </template>
      </PrimeCard>

      <PrimeCard class="shadow-none">
        <template #title>
          <h2 class="text-lg font-medium">特店資訊</h2>
        </template>

        <template #content>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-1">
              <p class="text-muted-color text-sm">分店名稱</p>
              <p>{{ branchMap[data.mid] ?? '—' }}</p>
            </div>

            <div class="space-y-1">
              <p class="text-muted-color text-sm">特店代號（MID）</p>
              <p>{{ data.mid }}</p>
            </div>

            <div class="space-y-1">
              <p class="text-muted-color text-sm">終端機代號（TID）</p>
              <p>{{ data.tid }}</p>
            </div>
          </div>
        </template>
      </PrimeCard>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { useTransaction } from '@/composables/useTransactions'
  import { formatMoney } from '@/utils'
  import { branchMap, statusConfig, paymentLabels } from '@/constants/transactions'

  const route = useRoute()

  const transactionId = computed(function () {
    return String(route.params.id ?? '')
  })

  const { data, isPending, isError } = useTransaction(transactionId)

  function formatDateTime(value: string) {
    return value.replace('T', ' ').slice(0, 16)
  }
</script>
