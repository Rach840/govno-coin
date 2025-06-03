<script lang="ts" setup>
import type { TabsItem } from "@nuxt/ui";

definePageMeta({
    pageTransition: { name: "shop", mode: "in-out" },
});

const products = ref<Product[] | null>(null);
const subs = ref<Product[]>([
    {
        skin_name: "Премиум на 1 месяц",
        skin_price: "1.00",
        skin_url: "/shop/1month.png",
        id: 0,
        skin_emission: 0,
    },
    {
        skin_name: "Премиум на 12 месяц",
        skin_price: "9.00",
        skin_url: "/shop/12month.png",
        id: 0,
        skin_emission: 0,
    },
]);

const { user, fetchWithValidate } = useUserStore();

watchEffect(async () => {
    const { data } = await fetchWithValidate("/shop/get_skins", {
        method: "POST",
        body: {
            user_id: user?.id,
        },
    });

    products.value = data as Product[];
});

const itemsMenu = [
    {
        label: "Все товары",
        slot: "all" as const,
    },
    {
        label: "Скины",
        slot: "skins" as const,
        ui: {
            trigger: " min-w-[76px]",
        },
    },
    {
        label: "Интерфейсы",
        slot: "interface" as const,
    },
    {
        label: "Другие",
        slot: "other" as const,
        ui: {
            trigger: " min-w-[82px]",
        },
    },
] satisfies TabsItem[];
const items = ["all", "skins", "interface", "other"];

const carousel = useTemplateRef("carousel");
const activeIndex = ref(0);

function select(index: number) {
    activeIndex.value = index;

    carousel.value?.emblaApi?.scrollTo(index);
}
</script>

<template>
    <div class="min-h-screen">
        <h1 class="mb-4 text-3xl text-white lg:text-2xl">Магазин</h1>
        <div class="mx-auto flex max-w-xs justify-between gap-1 pt-4">
            <div class="mt-4 mb-4 flex w-full gap-4 overflow-y-scroll">
                <UButton
                    v-for="(item, index) in itemsMenu"
                    :key="index"
                    :color="activeIndex == index ? 'info' : 'primary'"
                    :ui="{
                        label: 'text-sm ',
                    }"
                    class="bg-light-blue flex min-w-[111px] justify-center"
                    size="lg"
                    variant="solid"
                    @click="select(index)"
                    >{{ item.label }}
                </UButton>
            </div>
        </div>

        <div class="w-full flex-1">
            <UCarousel
                ref="carousel"
                v-slot="{ item }"
                :items="items"
                :ui="{
                    container: 'm-0 space-x-2',
                    item: 'w-full p-0 ',
                }"
                class="m-0 w-full"
            >
                <div class="space-y-3">
                    <ShopCard
                        v-for="product in products"
                        v-if="item == 'skins' || item == 'all'"
                        :product="product"
                    />
                    <ShopCard
                        v-for="sub in subs"
                        v-if="item == 'other' || item == 'all'"
                        :product="sub"
                        type="skin"
                    />
                    <h2 v-if="item == 'interface'" class="text-2xl">Скоро!</h2>
                </div>
            </UCarousel>
        </div>
    </div>
</template>
<style>
.shop-enter-active,
.shop-leave-active {
    transition:
        opacity 0.1s ease,
        transform 0.3s ease;
    position: absolute;
    top: 100px;
    width: 90vw;
}

.shop-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.shop-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>
