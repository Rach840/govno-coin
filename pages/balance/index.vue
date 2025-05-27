<template>
   <div ref="block" class="flex flex-col gap-5">
      <p class="text-(length:--h1) font-semibold text-center">$GOVNO кошелёк</p>
      <div
         class="bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)] rounded-[4vw] p-3.5 flex flex-col gap-5"
      >
         <div class="flex flex-col gap-0">
            <p class="text-(length:--support-text) text-(--support-text-color)">
               Общий баланс
            </p>
            <p class="text-(length:--h0) font-semibold">
               $ {{ moneyVal.usd >= 0 ? moneyVal.usd.toFixed(2) : "0.00" }}
            </p>
            <span
               class="text-(length:--support-text) text-(--support-text-color)"
               >~
               {{ moneyVal.govno >= 0 ? moneyVal.govno.toFixed(2) : "0.00" }}
               $GOVNO</span
            >
         </div>

         <div class="flex flex-col gap-0">
            <p class="text-(length:--support-text) text-(--support-text-color)">
               ❄️ В заморозке
            </p>
            <p class="text-(length:--h0) font-semibold">$ 0.00</p>
            <span
               class="text-(length:--support-text) text-(--support-text-color)"
               >~ 0.00 $GOVNO</span
            >
         </div>

         <div class="w-full flex flex-col gap-2.5">
            <div class="text-(length:--h3) flex gap-3.5">
               <button
                  class="balance-interaction-select-point text-(--support-text-color)"
                  @click="actionSelect = 'replenishment'"
                  :class="{
                     'underline underline-offset-1 decoration-(--main-blue) text-white':
                        actionSelect === 'replenishment',
                  }"
               >
                  Пополнение
               </button>
               <button
                  class="balance-interaction-select-point text-(--support-text-color)"
                  @click="actionSelect = 'withdrawal'"
                  :class="{
                     'underline underline-offset-1 decoration-(--main-blue) text-white':
                        actionSelect === 'withdrawal',
                  }"
               >
                  Вывод
               </button>
            </div>
            <div class="flex flex-col gap-3.5">
               <UInput
                  @focus="focusScroll"
                  v-model="stateValue"
                  variant="none"
                  class="border-1 border-(--line-gray) h-[13.1vw] rounded-[3.5vw] text-(length:--support-text)"
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
const { user, loading, refreshBalance, govno, usd } = useUserStore();
const { focusScroll } = useAdaptiveStore();
const actionSelect = ref<ActionType>("replenishment");
const moneyVal = ref<MoneyValues>({ usd: 0, govno: 0 });
const stateValue = ref<number>(0);

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
      if (actionSelect.value === "replenishment") {
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
      } else {
         const { data, status } = await useFetch(
            `${config.public.apiUrl}/balance/withdraw_govno`,
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

            window.Telegram?.WebApp?.showPopup({
               title: "💩 Внимание, ассенизатор!",
               message:
                  "Во время ЗБТ вывод токенов осуществляется вручную — чтобы никакой криптокит с лопатой не утащил всё в канализацию разом. Потерпите, автоматизация уже на подходе (на телеге с бочкой)!",
               buttons: [{ text: "OK", type: "ok" }],
            });
         }
      }
   } catch (error) {
      console.error("Ошибка при отправке суммы ❌❌❌", error);
   }
}
</script>
