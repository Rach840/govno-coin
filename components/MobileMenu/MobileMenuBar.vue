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
            :class="`fixed bottom-0 left-0 z-20 mt-14 flex w-full items-center justify-center gap-3 rounded-t-2xl bg-[#262827] py-4 ${fullPath == '/register/' ? 'hidden' : ''}`"
        >
            <UButton
                class="flex size-[15vw] items-center justify-center border-1 border-(--line-gray)"
                color="primary"
                to="/balance"
                variant="link"
                @click="() => (type == 'drawerMenu' ? updateOpen() : '')"
            >
                <img class="h-6 w-7" src="/menu/menu-balance.svg" />
            </UButton>
            <UButton
                v-for="button in otherButtons"
                class="flex size-[15vw] items-center justify-center bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)]"
                variant="link"
                @click="() => (type == 'drawerMenu' ? updateOpen() : '')"
            >
                <img :src="button.icon" class="h-10 w-10" />
            </UButton>

            <UButton
                class="pointer-events-auto flex size-[15vw] items-center justify-center border-1 border-(--line-gray)"
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
