<script lang="ts" setup></script>

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
