<script lang="ts" setup>
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
        class="padding-container mx-auto mb-[100px] min-h-screen w-[90vw] lg:hidden"
    >
        <slot />
        <MobileMenu />
    </UContainer>

    <main class="hidden w-full lg:block">
        <UContainer
            ref="container"
            class="padding-container mx-auto w-[80vw] py-6"
        >
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
