<template>
    <div class="grid grid-cols-4 gap-3">
        <UButton
            class="col-span-4 flex h-[13.1vw] items-center justify-center rounded-[3.5vw] bg-(--main-blue) text-(length:--support-text) !font-medium text-black"
            color="info"
            variant="solid"
            @click="replenishmentWithGovno"
        >
            {{ exchange?.toUsdt ? exchange?.toUsdt : "0.00" }} $GOVNO
        </UButton>
        <UButton
            class="col-span-2 flex h-[13.1vw] items-center justify-center rounded-[3.5vw] bg-white text-(length:--support-text) !font-medium text-[#737373]"
            variant="solid"
            @click="
                () => {
                    drawersContent[0].open.value = true;
                    console.log(drawersContent[0].open);
                }
            "
        >
            {{ numCurrent ? numCurrent : "0.00" }}
            <span class="text-[#709853]"> $USDT</span>
        </UButton>

        <UButton
            class="col-span-2 flex h-[13.1vw] items-center justify-center rounded-[3.5vw] bg-white text-(length:--support-text) !font-medium text-[#737373]"
            variant="solid"
            @click="drawersContent[1].open.value = true"
        >
            {{ exchange?.toTon ? exchange?.toTon : "0.00" }}
            <span class="text-[#008FEA]"> $TON</span>
        </UButton>
        <UButton
            class="col-span-4 flex h-[13.1vw] items-center justify-center rounded-[3.5vw] bg-white text-(length:--support-text) !font-medium text-[#737373]"
            target="_blank"
            to="https://g-crypto.ru/login"
            variant="solid"
        >
            {{ exchange?.toRub ? exchange?.toRub : "0.00" }} руб
            <span class="text-[#64CF13]">G-CRYPTO </span>
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
            body: 'bg-balance ',
            container: '',
            content: 'bg-balance !ring-transparent  !rounded-t-4xl  pt-4',
            handle: [
                ' mt-2 py-[0.1vw]  px-[9vw] !bg-[#737373] ',
                '  transition-opacity  ',
            ],
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
                    class="absolute top-3 right-6 text-[#737373]"
                    icon="i-lucide-x"
                    size="xl"
                    variant="ghost"
                    @click="drawer.open.value = false"
                />
                <div class="">
                    <h2 class="text-h2 mb-3">
                        Пополнение баланса токеном $USDT
                    </h2>
                    <p class="mb-3 text-lg">
                        ⚠️ Прямое пополнение в ${{ drawer.coin }} находится в
                        разработке.
                    </p>
                    <p class="mb-3 text-lg text-(--support-text-color)">
                        Вы можете обменять $USDT на $GOVNO в
                        <span class="text-[#008FEA]">Tonkeeper</span> и
                        произвести процедуру пополнения через $GOVNO
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
                    class="col-span-2 flex h-[13.1vw] items-center justify-center rounded-[3.5vw] bg-white text-(length:--support-text) !font-medium text-[#737373]"
                    target="_blank"
                    to="https://tonkeeper.com/"
                    variant="solid"
                    >Перейти в
                    <span class="text-[#008FEA]">Tonkeeper</span></UButton
                >

                <UButton
                    class="flex h-[12.6vw] w-full justify-center border-1 border-(--line-gray) bg-none px-4"
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
const { num } = defineProps<{ num: number }>();
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
    },
    {
        coin: "TON",
        image: "/balance/usdt 2.png",
        open: ref(false),
    },
];
watchEffect(async () => {
    numCurrent.value = !isNaN(num) ? +num : "0.00";
    exchange.value = await calcUsdExchange(num);
});
console.log(numCurrent.value, exchange.value, exchange.value);

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
