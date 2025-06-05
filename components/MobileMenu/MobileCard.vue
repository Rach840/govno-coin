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
    <UCard class="bg-balance w-full rounded-lg" variant="solid">
        <div class="flex w-full flex-col items-start justify-start gap-4">
            <div class="flex flex-col gap-0">
                <p class="text-(length:--h0) font-semibold text-white">
                    $ {{ moneyVal.usd >= 0 ? moneyVal.usd.toFixed(2) : "0.00" }}
                </p>
                <span class="text-support text-left font-[100]">
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
                        'z-50 bg-balance  ring-transparent  rounded-t-4xl  pt-4',
                    handle: [
                        ' mt-2 py-1 bg-[#616161] px-12 bg-muted ',
                            '  transition-opacity  ',
                    ],
                    overlay: 'bg-black/40',
                }"
                class="z-50 duration-500"
                side="bottom"
            >
                <UButton
                    class="bg-main-blue flex h-12 w-full justify-between px-3.5 font-medium"
                    trailing-icon="i-lucide-circle-plus"
                    >Пополнить баланс
                </UButton>

                <template #content>
                    <div class="bg-balance flex flex-col gap-3.5 px-6 pt-6">
                        <UButton
                            class="text-muted absolute top-4 right-6"
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
                                base: ' text-support bg-transparent p-4',
                                increment: 'h-full',

                                decrement: 'hidden',
                            }"
                            class="border-light-light-gray  text-support rounded-xl border w-full"
                            color="secondary"
                            orientation="vertical"
                            placeholder="Сумма пополнения"
                            size="xl"
                            type="number"
                            variant="none"
                            @focus="focusScroll"
                            @focusout="focusScrollUnlock"
                        >
                       <template #increment>
                  <UIcon name="i-lucide-dollar-sign" class="size-7 text-[#737373]" />
                </template>
                    </UInputNumber>
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
