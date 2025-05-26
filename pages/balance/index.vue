<template>
   <h1 class="text-white text-h1 lg:text-2xl mb-4">Внутренний кошелек</h1>
   <UCard
      variant="solid"
      :ui="{
         root: 'bg-balance',
      }"
      class="relative z-0"
   >
      <BalanceCard :moneyVal="moneyVal" />

      <UTabs
         v-model="active"
         :items="items"
         variant="link"
         color="info"
         size="xl"
         class="gap-4 w-full mt-4 mb-4"
         :ui="{ trigger: 'p-0 mr-7 ', label: 'text-lg', list: ' border-none' }"
      >
         <template #replenishment="{ item }">
            <UFormField name="replenishmentSum">
               <UInputNumber
                  orientation="vertical"
                  type="number"
                  :min="1"
                  size="xl"
                  variant="outline"
                  :ui="{
                     base: 'bg-transparent p-4',
                     increment: 'hidden',
                     decrement: 'hidden',
                  }"
                  color="secondary"
                  placeholder="Сумма пополнения ($GOVNO)"
                  v-model="state.replenishment"
                  class="w-full"
               />
            </UFormField>
         </template>
         <template #conclusion="{ item }">
            <UFormField name="conclusion">
               <UInputNumber
                  orientation="vertical"
                  type="number"
                  :min="1"
                  size="xl"
                  variant="outline"
                  :ui="{
                     base: 'bg-transparent p-4',
                     increment: 'hidden',
                     decrement: 'hidden',
                  }"
                  color="secondary"
                  placeholder="Сумма вывода ($GOVNO)"
                  v-model="state.conclusion"
                  class="w-full"
               />
            </UFormField>
         </template>
      </UTabs>
      <div class="space-y-4">
         <UButton
            variant="solid"
            class="w-full flex justify-center"
            @click="replenishmentPost"
            size="xxl"
            color="info"
            >Криптой</UButton
         >
         <UButton
            variant="solid"
            class="w-full flex justify-center"
            @click="withdrawPost"
            size="xxl"
            color="neutral"
            >Банковской картой</UButton
         >
      </div>
   </UCard>
</template>

<script setup lang="ts">
import { UButton } from "#components";
import type { TabsItem } from "@nuxt/ui";
import * as z from "zod";
const config = useRuntimeConfig();

const active = ref("0");
const state = reactive({
   replenishment: undefined,
   conclusion: undefined,
});

const items = [
   {
      label: "Пополнение",
      slot: "replenishment" as const,
   },
   {
      label: "Вывод",
      slot: "conclusion" as const,
   },
] satisfies TabsItem[];

const router = useRouter();
const { user, loading } = useUserStore();
const moneyVal = ref({
   usdt: "Загрузка",
   govno: "Загрузка",
});
watchEffect(async () => {
   if (!loading) {
      try {
         const { data, status } = await useFetch(
            `${config.public.apiUrl}/balance/get_balance`,
            {
               method: "post",
               body: { user_id: user?.id },
            },
         );

         console.log(status.value, data.value);
         if (status.value === "success") {
            moneyVal.value.usdt = parseFloat(data.value?.usd) || 0;
            moneyVal.value.govno = parseFloat(data.value?.govno) || 0;
         }
      } catch (error) {
         console.error("Ошибка при получении баланса ❌", error);
      }
   }
});
async function replenishmentPost() {
   try {
      if (active.value == "0") {
         const { data, status } = await useFetch(
            `${config.public.apiUrl}/balance/create_invoice`,
            {
              method: "post",
               body: {
                  title: "Пополнение",
                  price: state?.replenishment,
                  user_id: user?.id,
               },
            },
         );
         if (status.value == "success") {
            window.location.href = data.value;
         }
      } else {
         const { data, status } = await useFetch(
            `${config.public.apiUrl}/balance/withdraw_govno`,
            {
               method: "post",
               body: {
                  user_id: user?.id,
                  amount: state?.conclusion,
               },
            },
         );
         if (status.value == "success") {
            const { data, status } = await useFetch(
               `${config.public.apiUrl}/balance/get_balance`,
               {
                  method: "post",
                  body: { user_id: user?.id },
               },
            );

            moneyVal.value.govno = data.value.govno;
            moneyVal.value.usdt = data.value.usd;
            window.Telegram?.WebApp?.showPopup({
               title: "💩 Внимание, ассенизатор!",
               message:
                  "Во время ЗБТ вывод токенов осуществляется вручную — чтобы никакой криптокит с лопатой не утащил всё в канализацию разом. Потерпите, автоматизация уже на подходе (на телеге с бочкой)!",
               buttons: [{ text: "OK", type: "ok" }],
            });
         }
      }
      console.log(state.replenishment);
   } catch (error) {
      console.log("ошибка при отправке суммы пополнение баланса ❌❌❌");
   }
}
</script>
