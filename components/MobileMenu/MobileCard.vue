<template>
   <UCard variant="solid" class="w-full">
      <div class="w-full flex flex-col gap-4 items-start justify-start">
         <div class="flex flex-col gap-0">
            <p class="text-(length:--h0) font-semibold text-white">
               $ {{ moneyVal.usd >= 0 ? moneyVal.usd.toFixed(2) : "0.00" }}
            </p>
            <span
               class="text-left text-(length:--support-text) text-(--support-text-color) font-[100]"
            >
               ~
               {{
                  moneyVal.govno >= 0 ? moneyVal.govno.toFixed(2) : "0.00"
               }}
               $GOVNO
            </span>
         </div>
         <UDrawer
            :portal="true"
            :modal="true"
            side="bottom"
            overlay-class="bg-black/40"
            :ui="{
               body:'bg-balance ',
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
            <UButton
               class="w-full flex justify-between bg-(--main-blue) h-[12.6vw] font-medium px-3.5"
               to="/balance"
               trailing-icon="i-lucide-circle-plus"
               >Пополнить баланс</UButton
            >
          
           <template #content>
  <div class="flex flex-col bg-balance pt-6 px-6 gap-3.5">
   
<h2 class="text-h2">Пополнить баланс</h2>
                  <UInput
                     @focus="focusScroll"
                     v-model="stateValue"
                     variant="none"
                     placeholder="Сумма пополнения ($GOVNO)"
                     class="border-1 border-(--line-gray) h-[13.1vw] rounded-[3.5vw] text-(length:--support-text)"
                  />
                  <UButton
                     @click="handleSubmit"
                     class="h-[13.1vw] bg-(--main-blue) flex justify-center items-center text-black rounded-[3.5vw] text-(length:--support-text)"
                  >
                     Криптой
                  </UButton>
                  <NuxtLink
                     to="https://g-crypto.ru/login"
                     class="h-[13.1vw] bg-white flex justify-center items-center text-black rounded-[3.5vw] text-(length:--support-text)"
                  >
                     Банковской картой
                  </NuxtLink>
                  <div class="bg-[url(/balance/coin-balance.svg)] w-[234px] h-[189px] bg-cover mx-auto"></div>
               </div>
  
           </template>
             
         </UDrawer>
      </div>
   </UCard>
</template>

<script setup lang="ts">
const moneyVal = ref<MoneyValues>({ usd: 0, govno: 0 });
const stateValue = ref<number>();
const { focusScroll } = useAdaptiveStore();
const config = useRuntimeConfig();
const { user, loading, refreshBalance, govno, usd } = useUserStore();
watchEffect(async () => {
   if (!loading && user?.id) {
      try {
         await refreshBalance();

         moneyVal.value = {
            govno: govno,
            usd: usd,
         };
      } catch (e) {}
   }
});
async function handleSubmit() {
   if (!user?.id) return;

   try {
      const { data, status } = await useFetch(
         `${config.public.apiUrl}/balance/create_invoice`,
         {
            method: "post",
            body: {
               amount: stateValue.value,
               user_id: user.id,
            },
         },
      );

      if (status.value === "success" && data.value) {
         window.location.href = data.value;
      }

      if (status.value === "success") {
         await refreshBalance();

         window.Telegram?.WebApp?.showPopup({
            title: "💩 Внимание, ассенизатор!",
            message:
               "Во время ЗБТ вывод токенов осуществляется вручную — чтобы никакой криптокит с лопатой не утащил всё в канализацию разом. Потерпите, автоматизация уже на подходе (на телеге с бочкой)!",
            buttons: [{ text: "OK", type: "ok" }],
         });
      }
   } catch (error) {
      console.error("Ошибка при отправке суммы ❌❌❌", error);
   }
}
</script>
