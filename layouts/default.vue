<template>
  <UApp class="padding-container" >
    <TelegramPreloader v-if="loading" />
      <UContainer class="mb-[100px]" v-if="isMobile"  >
      <slot />
       <MobileMenu />
    </UContainer>
    <SidebarProvider v-else>
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
import { SidebarProvider } from "~/components/ui/sidebar";
import AdminSidebar from "~/components/AdminSidebar.vue";

// Показываем прелоадер до готовности Telegram WebApp
const { loading } = useUserStore();
const isLoading = ref(true);
const {isMobile} = useDevice();
watch(loading, () => {
  console.log(loading);
  isLoading.value = loading;
});
</script>
<style >
.trans-enter-active,
.trans-leave-active {
  transition: all 0.4s;
}
.trans-enter-from,
.trans-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>