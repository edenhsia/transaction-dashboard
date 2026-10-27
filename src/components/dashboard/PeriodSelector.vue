<template>
  <div class="bg-surface-100 flex w-fit rounded-full p-1">
    <button
      v-for="item in options"
      :key="item.value"
      type="button"
      class="cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors"
      :class="
        model === item.value
          ? 'bg-surface-0 text-primary shadow-sm'
          : 'text-muted-color hover:text-color'
      "
      :aria-pressed="model === item.value"
      @click="model = item.value"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
  type Period = 7 | 30 | 90

  type PeriodOption = {
    label: string
    value: Period
  }

  const model = defineModel<Period>({ required: true })

  const options: PeriodOption[] = [
    { label: '近 7 天', value: 7 },
    { label: '近 30 天', value: 30 },
    { label: '近 90 天', value: 90 },
  ]
</script>
