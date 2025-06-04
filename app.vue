<script lang="ts" setup>
const adaptiveStore = useAdaptiveStore();

onMounted(() => {
    document.addEventListener("resize", adaptiveStore.handleResize);
});

onBeforeUnmount(() => {
    document.removeEventListener("resize", adaptiveStore.handleResize);
});
</script>

<template>
    <Head>
        <Meta charset="utf-8" />
        <Meta
            content="width=device-width, initial-scale=1.0, user-scalable=no"
            name="viewport"
        />
    </Head>
    <UApp>
        <Suspense>
            <NuxtLayout name="default">
                <NuxtPage />
            </NuxtLayout>

            <template #fallback>
                <TelegramPreloader />
            </template>
        </Suspense>
    </UApp>
</template>
