<template>
  <PrimeCard>
    <template #title>
      <div class="flex items-center gap-2">
        <i class="pi pi-lightbulb text-primary" aria-hidden="true" />
        <h2 class="text-lg font-medium">營運摘要</h2>
      </div>
    </template>

    <template #content>
      <ul class="divide-surface-200 divide-y">
        <li
          v-for="item in items"
          :key="item.id"
          class="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
        >
          <div
            class="flex size-8 shrink-0 items-center justify-center rounded-full"
            :class="iconBackgroundClass[item.severity]"
          >
            <i :class="iconClass[item.severity]" aria-hidden="true" />
          </div>

          <div class="min-w-0 flex-1 space-y-1">
            <p class="text-surface-900 text-sm font-medium">{{ item.title }}</p>
            <p class="text-muted-color text-xs">{{ item.description }}</p>

            <RouterLink
              v-if="item.action"
              :to="{ path: '/transactions', query: item.action.query }"
              class="text-primary hover:text-primary-700 inline-flex items-center gap-1 pt-1 text-xs font-medium transition-colors"
            >
              {{ item.action.label }}
              <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
            </RouterLink>
          </div>
        </li>
      </ul>
    </template>
  </PrimeCard>
</template>

<script setup lang="ts">
  import type { DashboardInsight } from '@/services/dashboard'

  defineProps<{
    items: DashboardInsight[]
  }>()

  const iconBackgroundClass: Record<DashboardInsight['severity'], string> = {
    success: 'bg-green-50 text-green-600',
    warn: 'bg-orange-50 text-orange-600',
    info: 'bg-primary-50 text-primary-600',
  }

  const iconClass: Record<DashboardInsight['severity'], string> = {
    success: 'pi pi-check-circle text-sm',
    warn: 'pi pi-exclamation-triangle text-sm',
    info: 'pi pi-info-circle text-sm',
  }
</script>
