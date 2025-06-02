<template>
   <div ref="block" class="flex flex-col gap-5">
      <p class="text-(length:--h1) font-semibold text-center">$GOVNO кошелёк</p>
      <div
         class="relative bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)] rounded-[4vw] p-3.5 flex flex-col gap-5"
      >
         <BalanceCard :moneyVal="moneyVal" />
         <div class="w-full flex flex-col gap-2.5">
            <div class="text-(length:--h3) flex gap-3.5">
               <UButton
                  variant="link"
                  class="balance-interaction-select-point text-(--support-text-color) p-0 text-(length:--h4)"
                  @click="actionSelect = 'replenishment'"
                  :class="{
                     'underline underline-offset-6 decoration-(--main-blue) text-white':
                        actionSelect === 'replenishment',
                  }"
               >
                  Пополнение
               </UButton>
               <UButton
                  variant="link"
                  class="balance-interaction-select-point text-(--support-text-color) p-0 text-(length:--h4)"
                  @click="actionSelect = 'withdrawal'"
                  :class="{
                     'underline underline-offset-6 decoration-(--main-blue) text-white':
                        actionSelect === 'withdrawal',
                  }"
               >
                  Вывод
               </UButton>
            </div>
            <div class="flex flex-col gap-3.5">
               <UInputNumber
                  orientation="vertical"
                  type="number"
                  :min="1"
                  :max="1000"
                  @focus="(e) => focusScroll(e)"
                  @focusout="(e) => focusScrollUnlock(e)"
                  size="xl"
                  
                  trailing-icon="i-lucide-dollar-sign"
                  variant="none"
                  class="h-[13.1vw] rounded-[3.5vw] !text-(--support-text-color) border-1 !border-(--line-gray) text-(length:--support-text)"
                  :ui="{
                     base: '!text-(--support-text-color) bg-transparent p-4',
                     increment: 'hidden',
                     decrement: 'hidden',

                  }"
                  placeholder="Сумма пополнения $"
                  v-model="stateValue"
               />
               <UButton
                  @click="handleSubmit"
                  v-if="actionSelect == 'withdrawal'"
                  class="h-[13.1vw] bg-(--main-blue) flex justify-center items-center text-black rounded-[3.5vw] text-(length:--support-text)"
               >
                  Вывести
               </UButton>
               <BalanceExchange
                  :num="stateValue"
                  v-if="actionSelect == 'replenishment'"
               />
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { UButton } from "#components";

type ActionType = "replenishment" | "withdrawal";

const config = useRuntimeConfig();
const { user, loading, refreshBalance, govno, usd, fetchWithValidate } =
   useUserStore();
const { focusScroll, focusScrollUnlock } = useAdaptiveStore();
const actionSelect = ref<ActionType>("replenishment");
const moneyVal = ref<MoneyValues>({ usd: 0, govno: 0 });
const stateValue = ref<number | undefined>();

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
         const { data, status } = await fetchWithValidate(
            "/balance/withdraw_govno",
            {
               method: "post",
               body: {
                  user_id: user.id,
                  amount: stateValue.value,
               },
            },
         );

         if (status.value === "success") {
            await refreshBalance();
         }
      
   } catch (error) {
      console.error("Ошибка при отправке суммы ❌❌❌", error);
   }
}
</script>
