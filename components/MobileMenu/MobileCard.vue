<template>
   <UCard variant="solid" class="bg-balance w-full">
      <div class="w-full flex flex-col gap-4 items-start justify-start">
         <div class="flex flex-col gap-0">
            <p class="text-(length:--h0) font-semibold text-white">
               $ {{ moneyVal.usd >= 0 ? moneyVal.usd.toFixed(2) : "0.00" }}
            </p>
            <span
               class="text-left text-(length:--support-text) text-(--support-text-color) font-[100]"
            >
               ~
               {{ moneyVal.govno >= 0 ? moneyVal.govno.toFixed(2) : "0.00" }}
               $GOVNO
            </span>
         </div>
         <UDrawer
            :portal="true"
            :modal="true"
            v-model:open="openReplenishment"
            side="bottom"
            class="z-50 duration-500"
            :ui="{
               body: ' bg-balance ',

               container: '',
               content:
                  'z-50 bg-balance  !ring-transparent  !rounded-t-4xl  pt-4',
               handle: [
                  ' mt-2 py-[0.1vw]  px-[9vw] !bg-[#737373] ',
                  '  transition-opacity   ',
               ],
               overlay: 'bg-black/40',
            }"
            :transition="{
               enterActiveClass: 'duration-300',
               leaveActiveClass: 'duration-200',
            }"
         >
            <UButton
               class="w-full flex justify-between bg-(--main-blue) h-[12.6vw] font-medium px-3.5"
               trailing-icon="i-lucide-circle-plus"
               >Пополнить баланс</UButton
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
                  <h2 class="text-h2">Пополнить баланс</h2>

                  <UInputNumber
                     orientation="vertical"
                     type="number"
                     :min="1"
                     @focus="(e) => focusScroll(e)"
                     @focusout="(e) => focusScrollUnlock(e)"
                     size="xl"
                     variant="outline"
                     :ui="{
                        base: 'bg-transparent p-4',
                        increment: 'hidden',
                        decrement: 'hidden',
                     }"
                     color="secondary"
                     placeholder="Сумма пополнения ($GOVNO)"
                     v-model="stateValue"
                     class="border-(--line-gray) w-full text-(--support-text-color)"
                  />
                  <BalanceExchange :num="stateValue" />
                  <div
                     class="bg-[url(/balance/coin-balance.svg)] w-[234px] h-[189px] bg-cover mx-auto"
                  ></div>
               </div>
            </template>
         </UDrawer>
      </div>
   </UCard>
</template>

<script setup lang="ts">
const moneyVal = ref<MoneyValues>({ usd: 0, govno: 0 });
const stateValue = ref<number>();
const { focusScroll, focusScrollUnlock } = useAdaptiveStore();
const openReplenishment = ref(false);
const config = useRuntimeConfig();
const { open } = inject("open");
const { user, loading, refreshBalance, govno, usd, fetchWithValidate } =
   useUserStore();
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
watch(open, async () => {
   await refreshBalance();

   moneyVal.value = {
      govno: govno,
      usd: usd,
   };
});
async function handleSubmit() {
   if (!user?.id) return;

   try {
      const { data, status } = await fetchWithValidate(
         "/balance/create_invoice",
         {
            method: "post",
            body: {
               amount: +stateValue.value,
               user_id: user.id,
            },
         },
      );

      if (status.value === "success" && data.value) {
         window.location.href = data.value;
      }

      if (status.value === "success") {
         await refreshBalance();

         // window.Telegram?.WebApp?.showPopup({
         //    title: "💩 Внимание, ассенизатор!",
         //    message:
         //       "Во время ЗБТ вывод токенов осуществляется вручную — чтобы никакой криптокит с лопатой не утащил всё в канализацию разом. Потерпите, автоматизация уже на подходе (на телеге с бочкой)!",
         //    buttons: [{ text: "OK", type: "ok" }],
         // });
      }
   } catch (error) {
      console.error("Ошибка при отправке суммы ❌❌❌", error);
   }
}
</script>
