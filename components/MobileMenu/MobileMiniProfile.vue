<script lang="ts" setup>
const { user } = useUserStore();
</script>

<template>
    <div class="flex w-full items-center justify-start gap-3.5">
        <NuxtImg
            :src="user?.avatarUrl"
            alt=""
            class="size-16 rounded-full"
            preload
        />
        <div class="flex flex-col gap-1">
            <h4 class="text-(length:--h3) font-[100] text-white">
                {{ user?.firstName }} 🚀
            </h4>
            <span class="text-support text-left text-(length:--h5)">
                {{ user?.lastName }}
            </span>
        </div>
    </div>
</template>
