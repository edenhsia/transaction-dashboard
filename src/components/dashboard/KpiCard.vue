<template>
  <PrimeCard class="h-full shadow-none">
    <template #content>
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-3">
          <p class="text-muted-color text-sm">
            {{ label }}
          </p>

          <p class="text-surface-900 text-2xl font-semibold">
            {{ value }}
          </p>

          <p class="text-muted-color text-xs">
            {{ description }}
          </p>
        </div>

        <div
          class="bg-primary-50 text-primary-600 flex size-11 shrink-0 items-center justify-center rounded-xl"
        >
          <i :class="icon" class="text-xl" aria-hidden="true" />
        </div>
      </div>
    </template>
  </PrimeCard>
</template>

<script setup lang="ts">
  defineProps<{
    label: string
    value: string
    description: string
    icon: string
  }>()
</script>
