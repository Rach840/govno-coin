<script lang="ts" setup>
const { user } = useUserStore();
</script>

<template>
    <div class="flex w-full items-center justify-start gap-3.5">
        <NuxtImg
            :src="user.avatarUrl"
            alt=""
            class="size-[14vw] rounded-full"
            preload
        />
        <div class="flex flex-col gap-[0.5vw]">
            <h4 class="text-(length:--h3) font-[100] text-white">
                {{ user.firstName }} 🚀
            </h4>
            <span
                class="text-left text-(length:--h5) text-(--support-text-color)"
            >
                {{ user.lastName }}
            </span>
        </div>
    </div>
</template>
