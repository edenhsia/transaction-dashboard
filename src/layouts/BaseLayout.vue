<template>
  <div class="flex h-dvh overflow-hidden bg-zinc-50">
    <BaseSidebar :open="sidebarOpen" @close="closeSidebar" />

    <div class="flex min-w-0 flex-1 flex-col">
      <BaseHeader @toggle-sidebar="toggleSidebar" />

      <main class="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
        <RouterView />
      </main>
    </div>

    <PrimeConfirmDialog />
    <PrimeToast />
  </div>
</template>

<script setup lang="ts">
  const sidebarOpen = ref(false)

  function closeSidebar() {
    sidebarOpen.value = false
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }
</script>
