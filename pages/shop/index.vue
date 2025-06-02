
<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
definePageMeta({
  pageTransition: { name: "shop", mode: "in-out" },
})
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
watchEffect(async () => {
   const { data } = await fetchWithValidate("/shop/get_skins", {
      method: "post",
      body: {
         user_id: user?.id,
      },
   });

   products.value = data.value;
});
const itemsMenu = [
   {
      label: "Все товары",
      slot: "all" as const,
   },
   {
      label: "Скины",
      slot: "skins" as const,
      ui: {
         trigger: " min-w-[76px]",
      },
   },
   {
      label: "Интерфейсы",
      slot: "interface" as const,
   },
   {
      label: "Другие",
      slot: "other" as const,
      ui: {
         trigger: " min-w-[82px]",
      },
   },
] satisfies TabsItem[];
const items = ["all", "skins", "interface", "other"];

const carousel = useTemplateRef("carousel");
const activeIndex = ref(0);

function onSelect(index: number) {
   activeIndex.value = index;
}

function select(index: number) {
   activeIndex.value = index;

   carousel.value?.emblaApi?.scrollTo(index);
}
</script>

<template>
   <div class="min-h-screen">
<h1 class="text-white text-h1 lg:text-2xl mb-4">Магазин</h1>
   <div class="flex gap-1 justify-between pt-4 max-w-xs mx-auto">
      <div class="overflow-y-scroll gap-4 flex w-full mt-4 mb-4">
         <UButton
            variant="solid"
            @click="select(index)"
            :key="index"
            v-for="(item, index) in itemsMenu"
            size="lg"
            class="min-w-[111px] flex justify-center bg-[#2F363A]"
            :ui="{
               label: 'text-sm ',
            }"
            :color="activeIndex == index ? 'info' : 'primary'"
            >{{ item.label }}</UButton
         >
      </div>
   </div>

   <div class="flex-1 w-full">
      <UCarousel
         ref="carousel"
         v-slot="{ item }"
         :items="items"
         :ui="{
            container: 'm-0 space-x-2',
            item: 'w-full p-0 ',
         }"
         class="w-full !m-0"
      >
         <div class="space-y-3">
            <ShopCard
               v-if="item == 'skins' || item == 'all'"
               :product="product"
               v-for="product in products"
            />
            <ShopCard
               v-if="item == 'other' || item == 'all'"
               type="skin"
               :product="sub"
               v-for="sub in subs"
            />
            <h2 v-if="item == 'interface'" class="text-h2">Скоро!</h2>
         </div>
      </UCarousel>
   </div>
   </div>
   
</template>
<style>
.shop-enter-active,
.shop-leave-active {
  transition: opacity 0.1s ease, transform 0.3s ease;
  position: absolute;
  top: 100px;
width: 90vw;
}

.shop-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.shop-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>