<script lang="ts" setup>
type ActionType = "replenishment" | "withdrawal";

const { user, loading, refreshBalance, govno, usd, fetchWithValidate } =
    useUserStore();
const { focusScroll, focusScrollUnlock } = useAdaptiveStore();
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
        const { status } = await fetchWithValidate("/balance/withdraw_govno", {
            method: "POST",
            body: {
                user_id: user.id,
                amount: stateValue.value,
            },
        });

        if (status === "success") {
            await refreshBalance();
        }
    } catch (error) {
        console.error("Ошибка при отправке суммы ❌❌❌", error);
    }
}
</script>

<template>
    <div ref="block" class="flex flex-col gap-5">
        <p class="text-center text-(length:--h1) font-semibold">
            $GOVNO кошелёк
        </p>
        <div
            class="relative flex flex-col gap-5 rounded-[4vw] bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)] p-3.5"
        >
            <BalanceCard :moneyVal="moneyVal" />
            <div class="flex w-full flex-col gap-2.5">
                <div class="flex gap-3.5 text-(length:--h3)">
                    <UButton
                        :class="{
                            'text-white underline decoration-(--main-blue) underline-offset-6':
                                actionSelect === 'replenishment',
                        }"
                        class="balance-interaction-select-point p-0 text-(length:--h4) text-(--support-text-color)"
                        variant="link"
                        @click="actionSelect = 'replenishment'"
                    >
                        Пополнение
                    </UButton>
                    <UButton
                        :class="{
                            'text-white underline decoration-(--main-blue) underline-offset-6':
                                actionSelect === 'withdrawal',
                        }"
                        class="balance-interaction-select-point p-0 text-(length:--h4) text-(--support-text-color)"
                        variant="link"
                        @click="actionSelect = 'withdrawal'"
                    >
                        Вывод
                    </UButton>
                </div>
                <div class="flex flex-col gap-3.5">
                    <UInputNumber
                        v-model="stateValue"
                        :max="1000"
                        :min="1"
                        :ui="{
                            base: '!text-(--support-text-color) bg-transparent p-4',
                            increment: 'hidden',
                            decrement: 'hidden',
                        }"
                        class="h-[13.1vw] rounded-[3.5vw] border-1 !border-(--line-gray) text-(length:--support-text) !text-(--support-text-color)"
                        orientation="vertical"
                        placeholder="Сумма пополнения $"
                        size="xl"
                        trailing-icon="i-lucide-dollar-sign"
                        type="number"
                        variant="none"
                        @focus="focusScroll"
                        @focusout="focusScrollUnlock"
                    />
                    <UButton
                        v-if="actionSelect == 'withdrawal'"
                        class="flex h-[13.1vw] items-center justify-center rounded-[3.5vw] bg-(--main-blue) text-(length:--support-text) text-black"
                        @click="handleSubmit"
                    >
                        Вывести
                    </UButton>
                    <BalanceExchange
                        v-if="actionSelect == 'replenishment'"
                        :num="stateValue"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
