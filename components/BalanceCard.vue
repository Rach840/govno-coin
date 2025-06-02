<template>
   <img
      src="/balance/coin-balance.svg"
      class="w-[140px] h-[160px] absolute top-2.5 right-2.5"
      alt=""
   />
   <div class="flex flex-col gap-4">
      <div class="" v-for="balance in mockBalance">
         <p class="text-(length:--support-text) text-(--support-text-color)">
            {{ balance.title }}
         </p>
         <div class="flex flex-col">
            <p class="text-h0 font-bold text-white">
               $ {{ moneyVal.usd >= 0 ? moneyVal.usd.toFixed(2) : "0.00" }}
            </p>
            <span
               class="text-(length--support-text) text-(--support-text-color)"
            >
               ~
               {{ moneyVal.govno >= 0 ? moneyVal.govno.toFixed(2) : "0.00" }}
               $GOVNO
            </span>
         </div>
      </div>
   </div>
</template>
<script setup lang="ts">
const { moneyVal }: { moneyVal: Record<string, number> } = defineProps([
   "moneyVal",
]);
const mockBalance = ref<
   { title: string; valueUSD: string; valueGOVNO: string }[]
>([
   {
      title: "Общий баланс",
      valueUSD: "47 397.00",
      valueGOVNO: "61.5",
   },
   {
      title: "❄️ В заморозке",
      valueUSD: "100.00",
      valueGOVNO: "61.5",
   },
]);
</script>
