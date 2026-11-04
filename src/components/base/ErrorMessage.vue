<template>
  <PrimeMessage severity="error" :closable="false">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <span>{{ message }}</span>

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
</template>

<script setup lang="ts">
  import { reloadPage } from '@/utils'

  defineProps<{ message: string }>()
</script>
