<template>
  <header
    class="flex h-18 shrink-0 items-center gap-4 border-b border-zinc-200 bg-white px-4 md:px-6"
  >
    <button
      type="button"
      class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 md:hidden"
      aria-label="開啟選單"
      @click="emit('toggle-sidebar')"
    >
      <i class="pi pi-bars text-lg" aria-hidden="true" />
    </button>

    <h1 class="text-lg font-semibold text-zinc-900">
      {{ pageTitle }}
    </h1>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const emit = defineEmits<{
    'toggle-sidebar': []
  }>()

  const route = useRoute()

  const pageTitle = computed(function () {
    return String(route.meta.title ?? '管理後台')
  })
</script>
