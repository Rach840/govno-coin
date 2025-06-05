<script lang="ts" setup>
import { mockNews } from "~/lib/mockData";
const cacheStore = useCacheStore();
const news = ref<News[]>(cacheStore?.news);
</script>

<template>
    <div class="flex flex-col items-center justify-start gap-7">
        <!-- Заголовок страницы -->
        <p class="w-full text-start text-3xl font-semibold">Новости</p>

        <!-- Контейнер для всех новостей -->
        <div
            class="gap flex w-full flex-col items-center justify-center space-y-4"
        >
            <!-- Карточка новости -->
            <NewsCard
                v-for="(item, index) in news"
                :key="index"
                :date="item.date"
                :news="item"
            />
        </div>
    </div>
</template>
