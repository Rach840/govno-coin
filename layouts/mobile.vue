<template>
  <UApp>
    <TelegramPreloader v-if="loading" />
    <UContainer class="py-6 pb-20">
      <slot />
    </UContainer>
    <MobileMenu />
  </UApp>
</template>

<script setup lang="ts">
import { SidebarProvider } from "~/components/ui/sidebar";
import AdminSidebar from "~/components/AdminSidebar.vue";

// Показываем прелоадер до готовности Telegram WebApp
const { loading } = useUserStore();
const isLoading = ref(true);

watch(loading, () => {
  console.log(loading);
  isLoading.value = loading;
});
</script>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>