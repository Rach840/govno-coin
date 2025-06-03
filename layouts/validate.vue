<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core";

const isMobile = useMediaQuery("(max-width: 1024px)");

const user = useUserStore();
await user.loading;
</script>

<template>
    <UContainer
        v-if="isMobile"
        class="padding-container z-10 flex min-h-screen flex-col lg:hidden"
    >
        <div class="flex-1 px-5 py-10">
            <slot />
        </div>
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
