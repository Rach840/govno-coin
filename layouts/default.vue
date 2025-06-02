<template>
   <UApp class="">
      <TelegramPreloader v-if="loading" />
      <UContainer
         class="padding-container min-h-[100vh]  mx-auto w-[90vw] mb-[100px]"
         v-if="isMobile"
      >
         <slot />
         <MobileMenu />
      </UContainer>

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
import { useMediaQuery } from "@vueuse/core";
// Показываем прелоадер до готовности Telegram WebApp
const { loading } = useUserStore();

onMounted(() => {
  if (window.Telegram?.WebApp) {
    window.Telegram?.WebApp?.ready()
    window.Telegram?.WebApp?.expand()

  }
})
const isLoading = ref(true);
const menuV = ref(true);
const isMobile = useMediaQuery("(max-width: 900px)");
</script>
<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease, transform 0.4s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
