<template>
  <div v-if="open" class="fixed inset-0 z-40 bg-black/40 md:hidden" @click="emit('close')" />

  <aside
    class="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 md:static md:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex h-18 items-center justify-between border-b border-zinc-100 px-5">
      <div class="flex items-center gap-3">
        <div class="flex size-9 items-center justify-center rounded-lg bg-teal-600 text-white">
          <i class="pi pi-box text-lg" aria-hidden="true" />
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-zinc-900">Admin Console</span>
          <span class="text-xs text-zinc-500">Management system</span>
        </div>
      </div>

      <button
        type="button"
        class="text-zinc-500 md:hidden"
        aria-label="關閉選單"
        @click="emit('close')"
      >
        <i class="pi pi-times text-lg" aria-hidden="true" />
      </button>
    </div>

    <nav aria-label="主要導覽" class="flex-1 px-3 py-6">
      <p class="mb-3 px-3 text-xs font-medium text-zinc-400">管理功能</p>

      <div class="flex flex-col gap-1">
        <RouterLink
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          :class="
            isActive(item.path)
              ? 'bg-teal-50 text-teal-700'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          "
          :aria-current="isActive(item.path) ? 'page' : undefined"
          @click="emit('close')"
        >
          <i :class="item.icon" class="text-base" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>

    <div class="border-t border-zinc-100 px-5 py-4">
      <p class="text-xs text-zinc-400">Demo Environment</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
  defineProps<{
    open: boolean
  }>()

  const emit = defineEmits<{
    close: []
  }>()

  const route = useRoute()

  const navigation = [
    {
      label: '數據總覽',
      path: '/dashboard',
      icon: 'pi pi-chart-bar',
    },
    {
      label: '交易管理',
      path: '/transactions',
      icon: 'pi pi-receipt',
    },
  ]

  function isActive(path: string) {
    return route.path === path || route.path.startsWith(`${path}/`)
  }
</script>
