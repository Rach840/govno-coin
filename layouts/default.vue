<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core";

const isMobile = useMediaQuery("(max-width: 1024px)");
const user = useUserStore();
await user.loading;

onMounted(() => {
    if (window.Telegram?.WebApp) {
        window.Telegram?.WebApp?.ready();
        window.Telegram?.WebApp?.expand();
    }
});
</script>

<template>
    <UContainer
        v-if="isMobile"
        class="padding-container flex min-h-screen flex-col lg:hidden"
    >
        <div class="flex-1 px-5 py-10">
            <slot />
        </div>
        <MobileMenu />
    </UContainer>

    <main v-else class="hidden w-full lg:block">
        <UContainer class="padding-container mx-auto w-[80vw] py-6">
            <h1 class="text-center text-6xl text-white">
                Данное приложение пока работает только в мобильном режиме
            </h1>
        </UContainer>
    </main>
</template>

<style>
.page-enter-active,
.page-leave-active {
    transition:
        opacity 0.5s ease,
        transform 0.4s ease;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
