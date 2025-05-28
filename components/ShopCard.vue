<script setup lang="ts">
import { GitCommitVerticalIcon } from "lucide-vue-next";
import { number, string } from "zod";
const {user,  refreshBalance, govno, usd} = useUserStore()
const openErrorDrawer = ref(false);
const openConfirmDrawer = ref(false);
async function checkBalance() {
   await refreshBalance();
   if (govno > +product.skin_price){
openConfirmDrawer.value = true
   } else{
      openErrorDrawer.value = true
   }
}
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
               @click="checkBalance"
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
    <UDrawer
            :portal="true"
            :modal="true"
            v-model:open="openErrorDrawer"
            side="bottom"
            overlay-class="bg-black/40"
            :ui="{
               body: 'bg-balance ',
               container: '',
               content: 'bg-balance  !rounded-t-4xl  pt-4',
               handle: [
                  ' mt-2 py-[0.1vw]  px-[9vw] !bg-[#737373] ',
                  '  transition-opacity  ',
               ],
            }"
            :transition="{
               enterActiveClass: 'duration-300',
               leaveActiveClass: 'duration-200',
            }"
         >
         

            <template #content>
               <div class="flex flex-col bg-balance pt-6 px-6 gap-3.5">
                  <UButton
                     size="xl"
                     variant="ghost"
                     icon="i-lucide-x"
                     class="text-[#737373] absolute top-4 right-6"
                     @click="openReplenishment = false"
                  />
                  <h2 class="text-h2 mb-3">❌ Ошибка!</h2>
<p class="text-lg mb-3">Недостаточно средств на балансе внутреннего кошелька!</p>
<p class="text-lg text-(--support-text-color) mb-1">Недостаточно средств на балансе внутреннего кошелька!</p>
<div class="flex  items-center space-">
            <p class="text-h2 font-bold text-white"> {{ govno }} $GOVNO</p>
            <span
               class="text-(length--support-text) text-(--support-text-color)"
            >
               ~  $ {{ usd }}
            </span>
         </div>
               <UButton
               class="w-full flex justify-between bg-(--main-blue) h-[12.6vw] font-medium px-3.5"
               to="/balance"
               trailing-icon="i-lucide-circle-plus"
               >Пополнить баланс</UButton
            >
             <UButton
                  class="w-full flex justify-between h-[12.6vw] px-4 bg-none border-1 border-(--line-gray)"
                  :ui="{
                     trailingIcon: 'size-6',
                  }"
                  trailing-icon="i-lucide-move-right"
            @click="() => {openErrorDrawer = false}"
               
                  variant="link"
                  >Закрыть</UButton
               >
              
               </div>
            </template>
         </UDrawer>
</template>
