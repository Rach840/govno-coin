<template>
   <UApp class=" ">
      <TelegramPreloader v-if="loading" />
      <UContainer
         class="padding-container mx-auto w-[80vw] mb-[100px]"
         v-if="isMobile"
      >
         <slot />
         <MobileMenu />
      </UContainer>
      <!-- <SidebarProvider v-else>
         <AdminSidebar />
         <main class="w-full">
            <UContainer
               ref="container"
               class="padding-container mx-auto w-[80vw] py-6"
            >
               <slot />
            </UContainer>
         </main>
      </SidebarProvider> -->
      <main class="w-full" v-else>
         <UContainer
            ref="container"
            class="padding-container mx-auto w-[80vw] py-6"
         >
            <h1 class="text-6xl text-center text-white">
               Данное приложение пока работает только в мобильном режиме
            </h1>
         </UContainer>
      </main>
   </UApp>
</template>

<script setup lang="ts">
import { SidebarProvider } from "~/components/ui/sidebar";
import AdminSidebar from "~/components/AdminSidebar.vue";
import { useMediaQuery } from "@vueuse/core";
// Показываем прелоадер до готовности Telegram WebApp
const { loading } = useUserStore();
const isLoading = ref(true);
const isMobile = useMediaQuery("(max-width: 900px)");
watch(loading, () => {
   isLoading.value = loading;
});
</script>
<style>
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
