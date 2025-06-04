<script lang="ts" setup>
const adaptiveStore = useAdaptiveStore();

onMounted(() => {
    window.visualViewport?.addEventListener(
        "resize",
        adaptiveStore.updateViewport,
    );
});

onBeforeUnmount(() => {
    window.visualViewport?.removeEventListener(
        "resize",
        adaptiveStore.updateViewport,
    );
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
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>

            <template #fallback>
                <TelegramPreloader />
            </template>
        </Suspense>
    </UApp>
</template>
