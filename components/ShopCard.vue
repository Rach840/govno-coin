<script setup lang="ts">
import { number, string } from "zod";
const { product, type }: { product: Product; type?: string } = defineProps([
   "product",
   "type",
]);
const { user, refreshBalance, govno, usd, fetchWithValidate } = useUserStore();
const openErrorDrawer = ref(false);
const openConfirmDrawer = ref(false);
async function checkBalance() {
   await refreshBalance();
   if (govno > +product.skin_price) {
      openConfirmDrawer.value = true;
   } else {
      openErrorDrawer.value = true;
   }
}
async function buy(params:type) {
   if (type == 'sub') {
         const {data, status}  = await fetchWithValidate('/shop/purchase_premium',{
      method:'post',
      body:{
         user_id: user?.id,
         username: user.userName
      }
   })
   if (status.value == 'success') {
      openConfirmDrawer.value = false
   }
   }
   const {data, status}  = await fetchWithValidate('/shop/purchase_skin',{
      method:'post',
      body:{
         user_id: user?.id,
         skin_id: product.skin_id,
         username: user.userName
      }
   })
      if (status.value == 'success') {
      openConfirmDrawer.value = false
   }
} 

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
         content: 'bg-balance !ring-transparent  !rounded-t-4xl  pt-4',
         handle: [
            ' mt-2 py-[0.1vw]  px-[9vw] !bg-[#737373] ',
            '  transition-opacity  ',
         ],
          overlay: 'bg-black/40'
      }"
      :transition="{
         enterActiveClass: 'duration-300',
         leaveActiveClass: 'duration-200',
      }"
   >
      <template #content>
         <div class="flex flex-col  bg-balance pt-6 px-6 gap-3.5">
            <UButton
               size="xl"
               variant="ghost"
               icon="i-lucide-x"
               class="text-[#737373] absolute top-4 right-6"
               @click="openReplenishment = false"
            />
            <div class=" mb-56">
        <h2 class="text-h2 mb-3">❌ Ошибка!</h2>
            <p class="text-lg mb-3">
               Недостаточно средств на балансе внутреннего кошелька!
            </p>
            <p class="text-lg text-(--support-text-color) mb-1">
               Недостаточно средств на балансе внутреннего кошелька!
            </p>
            <div class="flex items-center space-">
               <p class="text-h2 font-bold text-white">{{ govno }} $GOVNO</p>
               <span
                  class="text-(length--support-text) text-(--support-text-color)"
               >
                  ~ $ {{ usd }}
               </span>
            </div>
            </div>
    
            <UButton
               class="w-full flex justify-between bg-(--main-blue) h-[12.6vw] font-medium px-3.5"
               to="/balance"
               trailing-icon="i-lucide-circle-plus"
               >Пополнить баланс</UButton
            >
            <UButton
               class="w-full flex justify-between h-[12.6vw] px-4 bg-none border-1 border-(--line-gray)"
  
               @click="
                  () => {
                     openErrorDrawer = false;
                  }
               "
               variant="link"
               >Закрыть</UButton
            >
         </div>
      </template>
   </UDrawer>
     <UDrawer
      :portal="true"
      :modal="true"
      v-model:open="openConfirmDrawer"
      side="bottom"
      overlay-class="bg-black/40"
      :ui="{
         body: 'bg-balance ',
         container: '',
         content: 'bg-balance !ring-transparent  !rounded-t-4xl  pt-4',
         handle: [
            ' mt-2 py-[0.1vw]  px-[9vw] !bg-[#737373] ',
            '  transition-opacity  ',
         ],
          overlay: 'bg-black/40'
      }"
      :transition="{
         enterActiveClass: 'duration-300',
         leaveActiveClass: 'duration-200',
      }"
   >
      <template #content>
         <div class="flex flex-col  bg-balance pt-6 px-6 gap-3.5">
            <UButton
               size="xl"
               variant="ghost"
               icon="i-lucide-x"
               class="text-[#737373] absolute top-4 right-6"
               @click="openReplenishment = false"
            />
            <div class=" mb-56">
        <h2 class="text-h2 mb-3">✅ Подтвердите покупку</h2>
            <p class="text-lg mb-3">
               Вы точно хотите купить?
            </p>
            <p class="text-lg text-(--support-text-color) mb-1">
               {{ product.skin_name }}
            </p>
            <div class="flex items-center space-">
               <p class="text-h2 font-bold text-white">{{ govno }} $GOVNO</p>
               <span
                  class="text-(length--support-text) text-(--support-text-color)"
               >
                  ~ $ {{ usd }}
               </span>
            </div>
            </div>
    
            <UButton
               class="w-full flex justify-between bg-(--main-blue) h-[12.6vw] font-medium px-3.5"
             @click=""
               trailing-icon="i-lucide-circle-plus"
               >Подтвердить покупку</UButton
            >
            <UButton
               class="w-full flex justify-between h-[12.6vw] px-4 bg-none border-1 border-(--line-gray)"
  
               @click="
                  () => {
                     openConfirmDrawer = false;
                  }
               "
               variant="link"
               >Закрыть</UButton
            >
             <div
                     class="bg-[url(/shop/check.png)] absolute bottom-0 right-0 w-[318px] h-[193px] bg-cover mr-auto"
                  ></div>
         </div>
      </template>
   </UDrawer>
</template>
