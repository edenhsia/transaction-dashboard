<template>
  <PrimeCard class="h-full">
    <template #content>
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-3">
          <p class="text-muted-color text-sm">
            {{ label }}
          </p>

          <p class="text-surface-900 text-2xl font-semibold">
            {{ value }}
          </p>

          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-muted-color">較前 {{ comparisonDays }} 天</span>
            <span class="inline-flex items-center gap-1 font-medium" :class="comparisonClass">
              <i :class="comparisonIcon" aria-hidden="true" />
              {{ comparison }}
            </span>
          </div>

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
  const props = defineProps<{
    label: string
    value: string
    description: string
    icon: string
    comparison: string
    comparisonDays: number
    comparisonDirection: 'up' | 'down' | 'neutral'
    comparisonTone: 'positive' | 'negative' | 'neutral'
  }>()

  const comparisonClass = computed(() => {
    return {
      'text-green-600': props.comparisonTone === 'positive',
      'text-red-600': props.comparisonTone === 'negative',
      'text-muted-color': props.comparisonTone === 'neutral',
    }
  })

  const comparisonIcon = computed(() => {
    if (props.comparisonDirection === 'up') return 'pi pi-arrow-up text-xs'
    if (props.comparisonDirection === 'down') return 'pi pi-arrow-down text-xs'

    return 'pi pi-minus text-xs'
  })
</script>
