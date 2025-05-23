<template>
  <UApp>
    <TelegramPreloader v-if="isLoading" />
    <SidebarProvider>
      <AdminSidebar />
      <main class="w-full">
        <UContainer class="py-6">
          <slot />
        </UContainer>
      </main>
    </SidebarProvider>
  </UApp>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SidebarProvider } from '~/components/ui/sidebar'
import AdminSidebar from '~/components/AdminSidebar.vue'

// Показываем прелоадер до готовности Telegram WebApp
const isLoading = ref(true)

onMounted(() => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready()
  }
  isLoading.value = false
})
</script>
