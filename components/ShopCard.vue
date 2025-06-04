<script lang="ts" setup>
const { product, type } = defineProps<{
    product: Product;
    type?: string;
}>();
const { user, refreshBalance, govno, usd, fetchWithValidate } = useUserStore();
const openErrorDrawer = ref(false);
const openDetailsDrawer = ref(false);
const openConfirmDrawer = ref(false);

async function checkBalance() {
    await refreshBalance();
    if (govno > +product.skin_price) {
        openConfirmDrawer.value = true;
    } else {
        openErrorDrawer.value = true;
    }
}

async function buy() {
    if (type == "sub") {
        const { data, status } = await fetchWithValidate(
            "/shop/purchase_premium",
            {
                method: "POST",
                body: {
                    user_id: user?.id,
                    username: user?.userName,
                },
            },
        );
        if (status == "success") {
            openConfirmDrawer.value = false;
        }
    }

    const { data, status } = await fetchWithValidate("/shop/purchase_skin", {
        method: "POST",
        body: {
            user_id: user?.id,
            skin_id: product.id,
            username: user?.userName,
        },
    });
    if (status == "success") {
        window.Telegram?.WebApp?.showPopup({
            title: `💩 ${product.skin_name} Скин уже у вас!`,
            message: "Теперь вы можете использовать его на карте!",
            buttons: [{ text: "Продолжить", type: "ok" }],
        });
        openConfirmDrawer.value = false;
    }
}
</script>
<template>
    <div class="rounded-[20px]">
        <div class="relative rounded-t-[20px] bg-black py-2.5">
            <UBadge
                v-if="type != 'skin'"
                class="bg-light-blue absolute top-3 left-3 text-white"
                color="primary"
                size="xl"
                variant="solid"
                >скины
            </UBadge>
            <UBadge
                v-if="type != 'skin'"
                class="bg-light-blue absolute top-3 right-3 text-white"
                color="primary"
                icon="i-lucide-boxes"
                size="xl"
                variant="solid"
                >{{ product.skin_emission }} шт
            </UBadge>

            <NuxtImg
                v-if="type != 'skin'"
                :src="product.skin_url"
                alt=""
                class="mx-auto h-[180px]"
            />
            <NuxtImg
                v-if="type == 'skin'"
                :src="product.skin_url"
                alt=""
                class="mx-auto h-[180px]"
            />
        </div>
        <div class="bg-card-gradient rounded-b-[20px] p-3">
            <p class="text-xl lg:text-xl">{{ product.skin_name }}</p>
            <div class="mb-4 flex items-center space-x-1">
                <p class="text-2xl lg:text-2xl">
                    {{ product.skin_price }} $GOVNO
                </p>
                <p class="text-support lg:text-xl">
                    ~ {{ +product.skin_price * 0.1 }} $USDT
                </p>
            </div>

            <div class="grid grid-cols-3 grid-rows-1">
                <UButton
                    class="border-ton col-span-2 flex justify-center border"
                    size="xxs"
                    variant="ghost"
                    @click="checkBalance"
                >
                    Купить
                </UButton>
                <UDrawer
                    v-model:open="openDetailsDrawer"
                    :modal="true"
                    :portal="true"
                    :transition="{
                        enterActiveClass: 'duration-300',
                        leaveActiveClass: 'duration-200',
                    }"
                    :ui="{
                        body: 'bg-balance ',
                        container: '',
                        content:
                            'bg-balance ring-transparent  rounded-t-4xl  pt-4',
                        handle: [
                            ' mt-2 py-1  px-12 bg-muted ',
                            '  transition-opacity  ',
                        ],
                        overlay: 'bg-black/40',
                    }"
                    overlay-class="bg-black/40"
                    side="bottom"
                >
                    <UButton
                        v-if="type != 'skin'"
                        class="col-span-1 flex justify-center"
                        size="xxs"
                        variant="ghost"
                        >Подробнее
                    </UButton>
                    <template #content>
                        <div class="bg-balance flex flex-col gap-3.5 py-11">
                            <UButton
                                :ui="{
                                    leadingIcon: 'size-8   ',
                                }"
                                class="text-muted absolute top-3 right-6"
                                icon="i-lucide-x"
                                size="xl"
                                variant="ghost"
                                @click="openDetailsDrawer = false"
                            />
                            <div class="">
                                <div class="relative mb-4 bg-black py-10">
                                    <div
                                        class="absolute top-3 left-3 flex items-center space-x-3"
                                    >
                                        <UBadge
                                            v-if="type != 'skin'"
                                            class="bg-light-blue text-white"
                                            color="primary"
                                            size="xl"
                                            variant="solid"
                                            >скины
                                        </UBadge>
                                        <UBadge
                                            v-if="type != 'skin'"
                                            class="bg-light-blue text-white"
                                            color="primary"
                                            icon="i-lucide-boxes"
                                            size="xl"
                                            variant="solid"
                                            >{{ product.skin_emission }}
                                            шт
                                        </UBadge>
                                    </div>

                                    <NuxtImg
                                        :src="product.skin_url"
                                        alt=""
                                        class="mx-auto h-[180px]"
                                    />
                                </div>
                                <div class="px-6">
                                    <h2 class="mb-3 text-2xl">
                                        {{ product.skin_name }}
                                    </h2>
                                    <p class="text-support mb-1 text-lg">
                                        Недостаточно средств на балансе
                                        внутреннего кошелька!
                                    </p>
                                    <div
                                        class="mb-4 flex items-center space-x-1"
                                    >
                                        <p class="text-2xl lg:text-2xl">
                                            {{ product.skin_price }} $GOVNO
                                        </p>
                                        <p class="text-support lg:text-xl">
                                            ~
                                            {{ +product.skin_price * 0.1 }}
                                            $USDT
                                        </p>
                                    </div>
                                    <UButton
                                        class="bg-main-blue mb-3 flex h-12 w-full justify-center px-3.5 font-medium"
                                        size="xxl"
                                        @click="buy"
                                        >Купить
                                    </UButton>
                                    <UButton
                                        class="border-light-light-gray flex h-12 w-full justify-center border bg-none px-4"
                                        variant="link"
                                        @click="
                                            () => {
                                                openDetailsDrawer = false;
                                            }
                                        "
                                        >Закрыть
                                    </UButton>
                                </div>
                            </div>
                        </div>
                    </template>
                </UDrawer>
            </div>
        </div>
    </div>

    <UDrawer
        v-model:open="openErrorDrawer"
        :modal="true"
        :portal="true"
        :transition="{
            enterActiveClass: 'duration-300',
            leaveActiveClass: 'duration-200',
        }"
        :ui="{
            body: 'bg-balance ',
            container: '',
            content: 'bg-balance ring-transparent  rounded-t-4xl  pt-4',
            handle: [' mt-2 py-1 px-12 bg-muted ', '  transition-opacity  '],
            overlay: 'bg-black/40',
        }"
        overlay-class="bg-black/40"
        side="bottom"
    >
        <template #content>
            <div class="bg-balance flex flex-col gap-3.5 px-6 py-6">
                <UButton
                    class="text-muted absolute top-4 right-6"
                    icon="i-lucide-x"
                    size="xl"
                    variant="ghost"
                    @click="openErrorDrawer = false"
                />
                <div class="mb-32">
                    <h2 class="mb-3 text-2xl">❌ Ошибка!</h2>
                    <p class="mb-3 text-lg">
                        Недостаточно средств на балансе внутреннего кошелька!
                    </p>
                    <p class="text-support mb-1 text-lg">
                        Недостаточно средств на балансе внутреннего кошелька!
                    </p>
                    <div class="space- flex items-center">
                        <p class="text-2xl font-bold text-white">
                            {{ govno }} $GOVNO
                        </p>
                        <span class="text-support"> ~ $ {{ usd }} </span>
                    </div>
                </div>

                <UButton
                    class="bg-main-blue flex h-12 w-full justify-between px-3.5 font-medium"
                    to="/balance"
                    trailing-icon="i-lucide-circle-plus"
                    >Пополнить баланс
                </UButton>
                <UButton
                    class="border-light-light-gray flex h-12 w-full justify-center border bg-none px-4"
                    variant="link"
                    @click="
                        () => {
                            openErrorDrawer = false;
                        }
                    "
                    >Закрыть
                </UButton>
            </div>
        </template>
    </UDrawer>
    <UDrawer
        v-model:open="openConfirmDrawer"
        :modal="true"
        :portal="true"
        :transition="{
            enterActiveClass: 'duration-300',
            leaveActiveClass: 'duration-200',
        }"
        :ui="{
            body: 'bg-balance ',
            container: '',
            content: 'bg-balance ring-transparent  rounded-t-4xl  pt-4',
            handle: [' mt-2 py-1 px-12 bg-muted ', '  transition-opacity  '],
            overlay: 'bg-black/40',
        }"
        overlay-class="bg-black/40"
        side="bottom"
    >
        <template #content>
            <div class="bg-balance flex flex-col gap-3.5 px-6 pt-6">
                <UButton
                    class="text-muted absolute top-4 right-6"
                    icon="i-lucide-x"
                    size="xl"
                    variant="ghost"
                    @click="openConfirmDrawer = false"
                />
                <div class="mb-56">
                    <h2 class="mb-3 text-2xl">✅ Подтвердите покупку</h2>
                    <p class="mb-3 text-lg">Вы точно хотите купить?</p>
                    <p class="text-support mb-1 text-lg">
                        {{ product.skin_name }}
                    </p>
                    <div class="space- flex items-center">
                        <p class="text-2xl font-bold text-white">
                            {{ govno }} $GOVNO
                        </p>
                        <span class="text-support"> ~ $ {{ usd }} </span>
                    </div>
                </div>

                <UButton
                    class="bg-main-blue flex h-12 w-full justify-between px-3.5 font-medium"
                    trailing-icon="i-lucide-circle-plus"
                    @click="buy"
                    >Подтвердить покупку
                </UButton>
                <UButton
                    class="border-light-light-gray flex h-12 w-full justify-center border bg-none px-4"
                    variant="link"
                    @click="openConfirmDrawer = false"
                    >Закрыть
                </UButton>
                <div
                    class="absolute right-0 bottom-0 mr-auto h-[193px] w-[318px] bg-[url(/shop/check.png)] bg-cover"
                ></div>
            </div>
        </template>
    </UDrawer>
</template>
