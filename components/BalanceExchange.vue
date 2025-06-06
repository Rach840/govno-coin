<template>
    <div class="grid grid-cols-4 gap-3">
        <UButton
            class="bg-main-blue col-span-4 flex items-center justify-center rounded-lg py-3 font-medium text-black"
            color="info"
            variant="solid"
            @click="replenishmentWithGovno"
        >
            {{ exchange?.toUsdt ? exchange?.toUsdt : "0.00" }} $GOVNO
        </UButton>
        <UButton
            class="text-muted col-span-2 flex items-center justify-center rounded-lg bg-white py-3 font-medium"
            variant="solid"
            @click="
                () => {
                    drawersContent[0].open.value = true;
                    console.log(drawersContent[0].open);
                }
            "
        >
            {{ numCurrent ? numCurrent : "0.00" }}
            <span class="text-usdt"> $USDT</span>
        </UButton>

        <UButton
            class="text-muted col-span-2 flex items-center justify-center rounded-lg bg-white py-3 font-medium"
            variant="solid"
            @click="drawersContent[1].open.value = true"
        >
            {{ exchange?.toTon ? exchange?.toTon : "0.00" }}
            <span class="text-ton"> $TON</span>
        </UButton>
        <UButton
            class="text-muted col-span-4 flex items-center justify-center rounded-lg bg-white py-3 font-medium"
            target="_blank"
            to="https://g-crypto.ru/login"
            variant="solid"
        >
            {{ exchange?.toRub ? exchange?.toRub : "0.00" }} руб
            <span class="text-gcrypto">G-CRYPTO </span>
        </UButton>
    </div>
    <UDrawer
        v-for="drawer in drawersContent"
        v-model:open="drawer.open.value"
        :modal="true"
        :portal="true"
        :transition="{
            enterActiveClass: 'duration-300',
            leaveActiveClass: 'duration-200',
        }"
        :ui="{
            body: 'bg-balance',
            container: '',
            content: 'bg-balance ring-transparent rounded-t-4xl pt-4',
            handle: [' mt-2 py-1 px-12 bg-muted ', '  transition-opacity  '],
            overlay: 'bg-black/40',
        }"
        overlay-class="bg-black/40"
        side="bottom"
    >
        <template #content>
            <div class="bg-balance flex flex-col gap-3.5 px-6 py-11">
                <UButton
                    :ui="{
                        leadingIcon: 'size-8',
                    }"
                    class="text-muted absolute top-3 right-6"
                    icon="i-lucide-x"
                    size="xl"
                    variant="ghost"
                    @click="drawer.open.value = false"
                />
                <div class="">
                    <h2 class="mb-3 text-2xl">
                        Пополнение баланса токеном $USDT
                    </h2>
                    <p class="mb-3 text-lg">
                        ⚠️ Прямое пополнение в ${{ drawer.coin }} находится в
                        разработке.
                    </p>
                    <p class="text-support mb-3 text-lg">
                        Вы можете обменять $USDT на $GOVNO в
                        <span class="text-ton">Tonkeeper</span> и произвести
                        процедуру пополнения через $GOVNO
                    </p>
                    <img
                        :src="drawer.image"
                        alt=""
                        class="mx-auto mb-2"
                        height="200px"
                        width="200px"
                    />
                </div>
                <UButton
                    class="text-muted col-span-2 flex items-center justify-center rounded-lg bg-white font-medium"
                    target="_blank"
                    :to="drawer.url"
                    variant="solid"
                    >Перейти в <span class="text-ton">Tonkeeper</span></UButton
                >

                <UButton
                    class="border-light-light-gray flex w-full justify-center border bg-none px-4"
                    variant="link"
                    @click="
                        () => {
                            drawer.open.value = false;
                        }
                    "
                    >Назад
                </UButton>
            </div>
        </template>
    </UDrawer>
</template>
<script lang="ts" setup>
const { num } = defineProps<{ num?: number }>();
const numCurrent = ref<string | number>("0.00");
const { user, calcUsdExchange, fetchWithValidate } = useUserStore();
const exchange = ref<Record<string, string> | null>({
    toUsdt: "0.00",
    toRub: "0.00",
    toTon: "0.00",
});
const router = useRouter();
const drawersContent = [
    {
        coin: "USDT",
        image: "/balance/usdt 1.png",
        open: ref(false),
        url:'https://app.tonkeeper.com/swap?ft=USDT&tt=EQBIWgKnh_qbFYTXfKgGAQPxkxFsArDOSr9n|ARSzydpNP (https://app.tonkeeper.com/swap?ft=USDT&tt=EQBIW)'
    },
    {
        coin: "TON",
        image: "/balance/usdt 2.png",
        open: ref(false),
        url: 'https://tonkeeper.com/'
    },
];
watchEffect(async () => {
    numCurrent.value = !isNaN(num ?? 0) ? +(num ?? 0) : "0.00";
    exchange.value = await calcUsdExchange(num ?? 0);
});

async function replenishmentWithGovno() {
    const { data, status } = await fetchWithValidate(
        "/balance/create_invoice",
        {
            method: "POST",
            body: {
                amount: numCurrent.value,
                user_id: user?.id,
            },
        },
    );

    if (status === "success" && data) {
        await router.push(data as string);
    }
}
</script>
