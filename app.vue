<script lang="ts" setup></script>

<template>
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
