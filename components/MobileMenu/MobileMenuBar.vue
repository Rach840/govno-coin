<script lang="ts" setup>
const { updateOpen } = inject("open");

const adaptiveStore = useAdaptiveStore();
const otherButtons = [
    {
        link: "",
        icon: "/menu/map.svg",
    },
    {
        link: "",
        icon: "/menu/battle.svg",
    },
    {
        link: "",
        icon: "/menu/wallet.svg",
    },
];
const { fullPath } = useRoute();
</script>

<template>
    <div
        v-if="adaptiveStore.menuVisible"
        :class="`bg-mobile-background sticky inset-x-0 bottom-0 z-20 ${fullPath == '/register/' ? 'hidden' : ''} ${$attrs.class}`"
    >
        <div
            class="flex w-full items-center justify-around gap-3 rounded-t-2xl py-4"
        >
            <UButton
                class="border-light-light-gray point flex size-12 items-center justify-center border"
                color="primary"
                to="/balance"
                variant="link"
                @click="updateOpen(false)"
            >
                <img class="h-6 w-7" src="/menu/menu-balance.svg" />
            </UButton>
            <UButton
                v-for="button in otherButtons"
                class="bg-gray-gradient flex size-12 items-center justify-center"
                variant="link"
                @click="updateOpen(false)"
            >
                <img :src="button.icon" class="h-10 w-10" />
            </UButton>

            <UButton
                class="border-light-light-gray flex size-12 items-center justify-center border"
                icon="i-lucide-ellipsis"
                variant="link"
                @click="updateOpen()"
            />
        </div>
    </div>
</template>
