<template>
   <div class="grid grid-cols-4 gap-3">
      <UButton
         @click="replenishmentWithGovno"
         variant="solid"
         color="info"
         class="h-[13.1vw] !font-medium col-span-4 bg-(--main-blue) flex justify-center items-center text-black rounded-[3.5vw] text-(length:--support-text)"
      >
         {{ exchange?.toUsdt ? exchange?.toUsdt : '0.00'}} $GOVNO
      </UButton>
      <UButton
         @click="()=> {drawersContent[0].open.value = true 
            console.log(drawersContent[0].open);
            
         }"
         variant="solid"
         class="h-[13.1vw] !font-medium col-span-2 bg-white flex justify-center items-center text-[#737373] rounded-[3.5vw] text-(length:--support-text)"
      >
         {{ numCurrent ? numCurrent : '0.00'}} <span class="text-[#709853]"> $USDT</span>
      </UButton>

      <UButton
         @click="drawersContent[1].open.value = true"
         variant="solid"
         class="h-[13.1vw] !font-medium col-span-2 bg-white flex justify-center items-center text-[#737373] rounded-[3.5vw] text-(length:--support-text)"
      >
         {{ exchange?.toTon ? exchange?.toTon  : '0.00' }} <span class="text-[#008FEA]"> $TON</span>
      </UButton>
      <UButton
        to="https://g-crypto.ru/login"
        target="_blank"
         variant="solid"
         class="h-[13.1vw] !font-medium col-span-4 bg-white flex justify-center items-center text-[#737373] rounded-[3.5vw] text-(length:--support-text)"
      >
         {{ exchange?.toRub ? exchange?.toRub : '0.00' }} руб <span class="text-[#64CF13]">G-CRYPTO </span>
      </UButton>
   </div>
   <UDrawer
      :portal="true"
      :modal="true"
      v-for="drawer in drawersContent"
      v-model:open="drawer.open.value"
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
         overlay: 'bg-black/40',
      }"
      :transition="{
         enterActiveClass: 'duration-300',
         leaveActiveClass: 'duration-200',
      }"
   >
      <template #content>
         <div class="flex flex-col bg-balance  px-6 py-11 gap-3.5">
            <UButton
               size="xl"
               variant="ghost"
               icon="i-lucide-x"
               class="text-[#737373] absolute top-3 right-6"
               :ui="{
                  leadingIcon: 'size-8',
               }"
               @click="drawer.open.value = false"
            />
            <div class="">
               <h2 class="text-h2 mb-3">Пополнение баланса токеном $USDT</h2>
               <p class="text-lg mb-3">
                  ⚠️ Прямое пополнение в ${{ drawer.coin }} находится в
                  разработке.
               </p>
               <p class="text-lg text-(--support-text-color) mb-3">
                  Вы можете обменять $USDT на $GOVNO в
                  <span class="text-[#008FEA]">Tonkeeper</span> и произвести
                  процедуру пополнения через $GOVNO
               </p>
               <img
                  :src="drawer.image"
                  width="200px"
                  height="200px"
                  class="mx-auto mb-2"
                  alt=""
               />
            </div>
            <UButton
               variant="solid"
               to="https://tonkeeper.com/"
               target="_blank"
               class="h-[13.1vw] !font-medium col-span-2 bg-white flex justify-center items-center text-[#737373] rounded-[3.5vw] text-(length:--support-text)"
               >Перейти в <span class="text-[#008FEA]">Tonkeeper</span></UButton
            >

            <UButton
               class="w-full flex justify-center h-[12.6vw] px-4 bg-none border-1 border-(--line-gray)"
               @click="
                  () => {
                     drawer.open.value = false;
                  }
               "
               variant="link"
               >Назад</UButton
            >
         </div>
      </template>
   </UDrawer>
</template>
<script setup lang="ts">
const { num }: { num: number } = defineProps(["num"]);
const numCurrent = ref<string | number>("0.00");
const { user, calcUsdExchange, fetchWithValidate } = useUserStore();
const exchange = ref<Record<string, string> | null>({
   toUsdt: '0.00',
   toRub: '0.00',
   toTon: '0.00',
});
const router = useRouter();
const drawersContent = [
   {
      coin: "USDT",
      image: "/balance/usdt 1.png",
      open: ref(false),
   },
   {
      coin: "TON",
      image: "/balance/usdt 2.png",
      open: ref(false),
   },
];
watchEffect(async () => {
   console.log(numCurrent);

   numCurrent.value = !isNaN(num) ? +num : "0.00";
   const exchangeCalc = await calcUsdExchange(num);
   exchange.value = exchangeCalc;
});
console.log(numCurrent.value, exchange.value, exchange.value);

async function replenishmentWithGovno() {
   const { data, status } = await fetchWithValidate("/balance/create_invoice", {
      method: "post",
      body: {
         amount: numCurrent.value,
         user_id: user?.id,
      },
   });

   if (status.value === "success" && data.value) {
    console.log(data.value)
    window.location.href = data.value
     
   }
}
</script>
