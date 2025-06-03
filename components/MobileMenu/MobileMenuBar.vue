<script lang="ts" setup>
const { updateOpen } = inject("open");
const menuVisible = computed(() => {
    return useAdaptiveStore().menuVisible;
});
const { type }: { type?: string } = defineProps(["type"]);
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
    <transition mode="out-in" name="fade-slide">
        <div
            v-if="menuVisible"
            :class="`bg-mobile-background sticky inset-x-0 bottom-0 z-20 mt-10 flex w-full items-center justify-around gap-3 rounded-t-2xl py-4 ${fullPath == '/register/' ? 'hidden' : ''}`"
        >
            <UButton
                class="border-light-light-gray flex size-12 items-center justify-center border"
                color="primary"
                to="/balance"
                variant="link"
                @click="() => (type == 'drawerMenu' ? updateOpen() : '')"
            >
                <img class="h-6 w-7" src="/menu/menu-balance.svg" />
            </UButton>
            <UButton
                v-for="button in otherButtons"
                class="bg-gray-gradient flex size-12 items-center justify-center"
                variant="link"
                @click="() => (type == 'drawerMenu' ? updateOpen() : '')"
            >
                <img :src="button.icon" class="h-10 w-10" />
            </UButton>

            <UButton
                class="border-light-light-gray pointer-events-auto flex size-12 items-center justify-center border"
                icon="i-lucide-ellipsis"
                variant="link"
                @click="(e) => updateOpen(e)"
            />
        </div>
    </transition>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>
