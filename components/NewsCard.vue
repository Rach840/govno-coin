<script setup lang="ts">
const { news, date }: { news: News; date: string } = defineProps([
   "news",
   "date",
]);
console.log(date);
</script>

<template>
   <UCard variant="solid" class="w-full">
      <div class="space-y-4 w-full">
         <!-- Заголовок новости -->
         <p class="text-lg text-white font-medium">{{ news.title }}</p>

         <!-- Содержание новости -->
         <p class="text-[length:15px] text-white font-normal">
            {{ news.content }}
         </p>

         <!-- Источник новости -->

         <!-- Источник-ссылка для криптовера -->
         <div class="space-x-1 flex justify-between">
            <p
               v-if="news.source !== 't.me/cryptover1'"
               class="text-[14px] font-normal text-[var(--support-text-color)]"
            >
               {{ news.source }}
            </p>
            <NuxtLink
               class="underline text-[#008EFA] text-sm"
               v-else
               :to="`https://t.me/cryptover1`"
            >
               t.me/cryptover1
            </NuxtLink>
            <h4
               class="text-[14px] font-normal text-[var(--support-text-color)]"
            >
               {{ date }}
            </h4>
         </div>
      </div>
   </UCard>
</template>
