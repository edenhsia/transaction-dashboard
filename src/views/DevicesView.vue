<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <p class="text-muted-color text-sm">管理各分店的終端設備與啟用狀態</p>
      <PrimeTag value="DEMO" severity="secondary" />
    </div>

    <PrimeMessage v-if="isError" severity="error">
      無法取得設備資料，請重新整理頁面。
    </PrimeMessage>

    <PrimeCard v-else>
      <template #title>設備列表</template>

      <template #content>
        <PrimeDataTable :value="deviceList" :loading="isPending" data-key="tid">
          <PrimeColumn header="分店">
            <template #body="{ data }">
              {{ branchMap[data.mid] ?? '未知分店' }}
            </template>
          </PrimeColumn>

          <PrimeColumn field="mid" header="MID" />
          <PrimeColumn field="tid" header="TID" />

          <PrimeColumn header="狀態">
            <template #body="{ data }">
              <PrimeTag
                :value="data.enabled ? '已啟用' : '已停用'"
                :severity="data.enabled ? 'success' : 'danger'"
              />
            </template>
          </PrimeColumn>

          <PrimeColumn header="操作">
            <template #body="{ data }">
              <PrimeButton
                :label="data.enabled ? '停用' : '啟用'"
                :severity="data.enabled ? 'danger' : 'secondary'"
                outlined
                size="small"
                class="w-16"
                :loading="isUpdating(data)"
                :disabled="isUpdatingDevice"
                @click="handleToggle(data)"
              />
            </template>
          </PrimeColumn>

          <template #empty>目前沒有設備資料</template>
        </PrimeDataTable>
      </template>
    </PrimeCard>
  </div>
</template>

<script setup lang="ts">
  import { useToast } from 'primevue/usetoast'
  import { branchMap } from '@/constants/transactions'
  import { useDevices, useUpdateDevice } from '@/composables/useDevices'
  import type { Device } from '@/services/devices'

  const toast = useToast()

  const { data, isPending, isError } = useDevices()
  const { mutateAsync, isPending: isUpdatingDevice } = useUpdateDevice()

  const updatingDevice = ref<string | null>(null)

  const deviceList = computed(function () {
    return data.value?.data ?? []
  })

  function isUpdating(device: Device) {
    return updatingDevice.value === `${device.mid}:${device.tid}`
  }

  async function handleToggle(device: Device) {
    updatingDevice.value = `${device.mid}:${device.tid}`

    try {
      await mutateAsync({
        mid: device.mid,
        tid: device.tid,
        enabled: !device.enabled,
      })

      toast.add({
        severity: 'success',
        summary: '更新成功',
        detail: `設備 ${device.tid} 已${device.enabled ? '停用' : '啟用'}`,
        life: 3000,
      })
    } catch {
      toast.add({
        severity: 'error',
        summary: '更新失敗',
        detail: '無法更新設備狀態，請重新整理後再試。',
        life: 3000,
      })
    } finally {
      updatingDevice.value = null
    }
  }
</script>
