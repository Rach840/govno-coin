<script lang="ts" setup>
const router = useRouter();

const moneyVal = ref<MoneyValues>({ usd: 0, govno: 0 });
const stateValue = ref<number>();

const { focusScroll, focusScrollUnlock } = useAdaptiveStore();

const openReplenishment = ref(false);

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
                method: "POST",
                body: {
                    amount: +stateValue.value,
                    user_id: user.id,
                },
            },
        );

        if (status === "success" && data) {
            await router.push(data as string);
        }

        if (status === "success") {
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

<template>
    <UCard class="bg-balance w-full" variant="solid">
        <div class="flex w-full flex-col items-start justify-start gap-4">
            <div class="flex flex-col gap-0">
                <p class="text-(length:--h0) font-semibold text-white">
                    $ {{ moneyVal.usd >= 0 ? moneyVal.usd.toFixed(2) : "0.00" }}
                </p>
                <span
                    class="text-left text-(length:--support-text) font-[100] text-(--support-text-color)"
                >
                    ~
                    {{
                        moneyVal.govno >= 0 ? moneyVal.govno.toFixed(2) : "0.00"
                    }}
                    $GOVNO
                </span>
            </div>
            <UDrawer
                v-model:open="openReplenishment"
                :modal="true"
                :portal="true"
                :transition="{
                    enterActiveClass: 'duration-300',
                    leaveActiveClass: 'duration-200',
                }"
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
                class="z-50 duration-500"
                side="bottom"
            >
                <UButton
                    class="flex h-[12.6vw] w-full justify-between bg-(--main-blue) px-3.5 font-medium"
                    trailing-icon="i-lucide-circle-plus"
                    >Пополнить баланс
                </UButton>

                <template #content>
                    <div class="bg-balance flex flex-col gap-3.5 px-6 pt-6">
                        <UButton
                            class="absolute top-4 right-6 text-[#737373]"
                            icon="i-lucide-x"
                            size="xl"
                            variant="ghost"
                            @click="openReplenishment = false"
                        />
                        <h2 class="text-2xl">Пополнить баланс</h2>

                        <UInputNumber
                            v-model="stateValue"
                            :min="1"
                            :ui="{
                                base: 'bg-transparent p-4',
                                increment: 'hidden',
                                decrement: 'hidden',
                            }"
                            class="w-full border-(--line-gray) text-(--support-text-color)"
                            color="secondary"
                            orientation="vertical"
                            placeholder="Сумма пополнения ($GOVNO)"
                            size="xl"
                            type="number"
                            variant="outline"
                            @focus="focusScroll"
                            @focusout="focusScrollUnlock"
                        />
                        <BalanceExchange :num="stateValue" />
                        <div
                            class="mx-auto h-[189px] w-[234px] bg-[url(/balance/coin-balance.svg)] bg-cover"
                        ></div>
                    </div>
                </template>
            </UDrawer>
        </div>
    </UCard>
</template>
