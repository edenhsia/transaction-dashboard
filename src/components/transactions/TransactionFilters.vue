<template>
  <PrimeCard>
    <template #title>
      <h2 class="text-lg font-medium">交易條件篩選</h2>
    </template>

    <template #content>
      <form class="space-y-4" @submit.prevent="handleSearch">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-2">
            <label for="transaction-date" class="text-sm">交易日期</label>
            <PrimeDatePicker
              id="transaction-date"
              v-model="dateRange"
              selection-mode="range"
              date-format="yy/mm/dd"
              :max-date="maxDate"
              show-icon
              fluid
              icon-display="input"
              placeholder="選擇日期範圍"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="transaction-mid" class="text-sm">分店（MID）</label>
            <PrimeSelect
              id="transaction-mid"
              v-model="filters.mid"
              :options="branchOptions"
              option-label="label"
              option-value="value"
              placeholder="全部分店"
              show-clear
              fluid
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="transaction-status" class="text-sm">交易狀態</label>
            <PrimeSelect
              id="transaction-status"
              v-model="filters.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="全部狀態"
              show-clear
              fluid
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="transaction-id" class="text-sm">交易編號</label>
            <PrimeInputText
              id="transaction-id"
              v-model="filters.id"
              placeholder="輸入交易編號"
              fluid
            />
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <PrimeButton
            type="button"
            label="重設"
            severity="secondary"
            outlined
            @click="handleReset"
          />

          <PrimeButton type="submit" label="查詢" icon="pi pi-search" />
        </div>
      </form>
    </template>
  </PrimeCard>
</template>

<script setup lang="ts">
  import branches from '@/data/branches.json'

  export type TransactionFilterValues = {
    id: string
    mid: string | null
    status: string | null
    startDate: string
    endDate: string
  }

  const emit = defineEmits<{
    search: [filters: TransactionFilterValues]
  }>()

  const props = defineProps<{
    initialFilters: TransactionFilterValues
  }>()

  const filters = reactive({
    id: '',
    mid: null as string | null,
    status: null as string | null,
  })

  const dateRange = ref<Date[] | null>(null)
  const maxDate = new Date(2026, 9, 27)

  const branchOptions = branches.map(function (branch) {
    return {
      label: `${branch.name}（${branch.mid}）`,
      value: branch.mid,
    }
  })

  const statusOptions = [
    { label: '成功', value: 'success' },
    { label: '失敗', value: 'failed' },
    { label: '處理中', value: 'pending' },
  ]

  function formatDate(date?: Date | null) {
    if (!date) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  function handleSearch() {
    emit('search', {
      id: filters.id.trim(),
      mid: filters.mid,
      status: filters.status,
      startDate: formatDate(dateRange.value?.[0]),
      endDate: formatDate(dateRange.value?.[1]),
    })
  }

  function handleReset() {
    filters.id = ''
    filters.mid = null
    filters.status = null
    dateRange.value = null

    handleSearch()
  }

  function parseDate(value: string): Date | null {
    if (!value) return null

    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    if (
      !year ||
      !month ||
      !day ||
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null
    }

    return date
  }

  watch(
    () => props.initialFilters,
    (values) => {
      filters.id = values.id
      filters.mid = values.mid
      filters.status = values.status

      const start = parseDate(values.startDate)
      const end = parseDate(values.endDate)

      dateRange.value = start ? (end ? [start, end] : [start]) : null
    },
    { immediate: true },
  )
</script>
