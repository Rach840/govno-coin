<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
definePageMeta({
   pageTransition: { name: "trans", mode: "default" },
});
const products = ref<Product[] | null>(null);
const subs = ref<Product[]>([
   {
      skin_name: "Премиум на 1 месяц",
      skin_price: "1.00",
      skin_url: "/shop/1month.png",
      id: 0,
      skin_emission: 0,
   },
   {
      skin_name: "Премиум на 12 месяц",
      skin_price: "9.00",
      skin_url: "/shop/12month.png",
      id: 0,
      skin_emission: 0,
   },
]);
const { user, fetchWithValidate } = useUserStore();
const config = useRuntimeConfig();
const active = ref(1);
watchEffect(async () => {
   const {data} = await fetchWithValidate('/shop/get_skins', {
 method: "post",
         body: {
            user_id: user?.id,
         },
   })

   products.value = data.value;
});
const items = [
   {
      label: "Все товары",
      slot: "all" as const,
   },
   {
      label: "Скины",
      slot: "skins" as const,
   },
   {
      label: "Интерфейсы",
      slot: "interface" as const,
   },
   {
      label: "Другие",
      slot: "other" as const,
   },
] satisfies TabsItem[];
</script>
<template>
   <h1 class="text-white text-h1 lg:text-2xl mb-4">Магазин</h1>
   <div class="w-full overflow-x-auto"></div>

   <UTabs
      :items="items"
      variant="pill"
      color="info"
      size="xl"
      class="overflow-hidden gap-4 w-full mt-4 mb-4"
      :ui="{
         trigger:
            'px-2 py-3 mr-4 min-w-[130px] bg-[#2F363A]  data-[state=active]:bg-transparent data-[state=active]:!text-white !text-[#B8B8B8] ',
         label: 'text-lg z-50',
         list: 'w-full   overflow-scroll bg-transparent border-none',
      }"
   >
      <template #all="{ item }">
         <div class="space-y-3">
            <ShopCard :product="product" v-for="product in products" />
            <ShopCard type="skin" :product="sub" v-for="sub in subs" />
         </div>
      </template>
      <template #skins="{ item }">
         <div class="space-y-3">
            <ShopCard :product="product" v-for="product in products" />
         </div>
      </template>
      <template #interface="{ item }">
         <div class="">
            <h2 class="text-h2">Скоро!</h2>
         </div>
      </template>
      <template #other="{ item }">
         <div class="space-y-3">
            <ShopCard type="skin" :product="sub" v-for="sub in subs" />
         </div>
      </template>
   </UTabs>
</template>
