<script lang="ts" setup>
const { moneyVal } = defineProps<{
    moneyVal: Record<string, number>;
}>();
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

<template>
    <img
        alt=""
        class="absolute top-2.5 right-2.5 h-[160px] w-[140px]"
        src="/balance/coin-balance.svg"
    />
    <div class="flex flex-col gap-4">
        <div v-for="balance in mockBalance" class="">
            <p class="text-support">
                {{ balance.title }}
            </p>
            <div class="flex flex-col">
                <p class="text-4xl font-bold text-white">
                    $ {{ moneyVal.usd >= 0 ? moneyVal.usd.toFixed(2) : "0.00" }}
                </p>
                <span class="text-(length--support-text) text-support">
                    ~
                    {{
                        moneyVal.govno >= 0 ? moneyVal.govno.toFixed(2) : "0.00"
                    }}
                    $GOVNO
                </span>
            </div>
        </div>
    </div>
</template>
