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
                     'underline underline-offset-1 decoration-(--main-blue) text-white':
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
                     'underline underline-offset-1 decoration-(--main-blue) text-white':
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
                  @focus="(e) => focusScroll(e)"
                  @focusout="(e) => focusScrollUnlock(e)"
                  size="xl"
                  variant="outline"
                  class="h-[13.1vw] rounded-[3.5vw] text-(--support-text-color) text-(length:--support-text)"
                  :ui="{
                     base: 'bg-transparent p-4',
                     increment: 'hidden',
                     decrement: 'hidden',
                  }"
                  color="secondary"
                  placeholder="Сумма пополнения ($GOVNO)"
                  v-model="stateValue"
               />
               <UButton
                  @click="handleSubmit"
                  class="h-[13.1vw] bg-(--main-blue) flex justify-center items-center text-black rounded-[3.5vw] text-(length:--support-text)"
                  :class="{ 'bg-red-500': actionSelect !== 'replenishment' }"
               >
                  {{ actionSelect == "replenishment" ? "Криптой" : "Вывести" }}
               </UButton>
               <NuxtLink
                  v-if="actionSelect == 'replenishment'"
                  to="https://g-crypto.ru/login"
                  class="h-[13.1vw] bg-white flex justify-center items-center text-black rounded-[3.5vw] text-(length:--support-text)"
               >
                  Банковской картой
               </NuxtLink>
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
         console.log("balanceVal", govno, usd);

         moneyVal.value = {
            govno: govno,
            usd: usd,
         };
      } catch (e) {}
   }
});
definePageMeta({
   pageTransition: { name: "trans", mode: "default" },
});
async function handleSubmit() {
   if (!user?.id) return;

   try {
      if (actionSelect.value === "replenishment") {
         const { data, status } = await fetchWithValidate(
            "/balance/create_invoice",
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
      } else {
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
      }
   } catch (error) {
      console.error("Ошибка при отправке суммы ❌❌❌", error);
   }
}
</script>
