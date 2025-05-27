<script setup lang="ts">
import { number, string } from "zod";

const { product, type }: { product: Product; type?: string } = defineProps([
   "product",
   "type",
]);
</script>
<template>
   <div class="rounded-[20px]">
      <div class="relative rounded-t-[20px] py-2.5 bg-black">
         <UBadge
            v-if="type != 'skin'"
            size="xl"
            color="primary"
            variant="solid"
            class="absolute bg-[#2F363A] text-white left-3 top-3"
            >скины</UBadge
         >
         <UBadge
            icon="i-lucide-boxes"
            v-if="type != 'skin'"
            size="xl"
            color="primary"
            variant="solid"
            class="absolute bg-[#2F363A] text-white right-3 top-3"
            >{{ product.skin_emission }} шт</UBadge
         >
         <img :src="product.skin_url" alt="" class="mx-auto h-[180px]" />
      </div>
      <div class="bg-card-gradient rounded-b-[20px] p-3">
         <p class="text-xl lg:text-xl">{{ product.skin_name }}</p>
         <div class="flex items-center space-x-1 mb-4">
            <p class="text-h2 lg:text-2xl">{{ product.skin_price }} $GOVNO</p>
            <p
               class="text-(length--support-text) text-(--support-text-color) lg:text-xl"
            >
               ~ {{ +product.skin_price * 0.1 }} $USDT
            </p>
         </div>

         <div class="grid grid-cols-3 grid-rows-1">
            <UButton
               variant="ghost"
               class="col-span-2 flex justify-center !border-[#008FEA] border"
               size="xxs"
               >Купить
            </UButton>
            <UButton
               v-if="type != 'skin'"
               variant="ghost"
               class="col-span-1 flex justify-center"
               size="xxs"
               >Подробнее
            </UButton>
         </div>
      </div>
   </div>
</template>
