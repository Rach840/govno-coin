<script lang="ts" setup></script>

<template>
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
