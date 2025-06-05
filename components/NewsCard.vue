<script lang="ts" setup>
const { news } = defineProps<{
    news: News;
    date: string;
}>();
</script>

<template>
    <UCard class="bg-balance w-full" variant="solid">
        <div class=" w-full border-0 space-y-4">
            <p class="text-lg font-medium text-white">{{ news.title }}</p>
            <p class="text-[length:15px] font-normal text-white">
                {{ news.content }}
            </p>
            <div class="flex justify-between space-x-1">
                <p
                    v-if="news.source !== 't.me/cryptover1'"
                    class="text-sm font-normal text-support"
                >
                    {{ news.source }}
                </p>
                <a
                    v-else
                    class="text-ton text-sm underline"
                    href="`https://t.me/cryptover1`"
                >
                    t.me/cryptover1
                </a>
                <h4
                    class="text-sm font-normal text-support"
                >
                    {{ news.date }}
                </h4>
            </div>
        </div>
    </UCard>
</template>
