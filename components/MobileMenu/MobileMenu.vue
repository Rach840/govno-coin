<script lang="ts" setup>
import MobileMiniProfile from "~/components/MobileMenu/MobileMiniProfile.vue";
import MobileCard from "~/components/MobileMenu/MobileCard.vue";
import { Drawer, DrawerContent } from "~/components/ui/drawer";

const open = ref<boolean>(false);
const updateOpen = (state?: boolean) =>
    state !== undefined ? (open.value = state) : (open.value = !open.value);

provide("open", {
    open,
    updateOpen,
});

const navigation = [
    {
        name: "Задания",
        link: "/balance",
    },
    {
        name: "Магазин",
        link: "/shop",
    },
    {
        name: "Опрос",
        link: "/quiz",
    },
    {
        name: "Новости",
        link: "/news",
    },
    {
        name: "Партнеры",
        link: "/balance",
    },
];

const router = useRouter();

const delayedOpen = ref<boolean>(open.value);

watchEffect(() => {
    if (!open.value) {
        setTimeout(() => {
            delayedOpen.value = false;
        }, 300);
    } else {
        delayedOpen.value = true;
    }
});
const container = useTemplateRef("container");

let drawerStartY = 0;

const drawerOnTouchStart = (e: TouchEvent) => {
    drawerStartY = e.touches[0].clientY;
};

const drawerOnTouchMove = (e: TouchEvent) => {
    const currentY = e.changedTouches[0].clientY;
    const diffY = currentY - drawerStartY;
    if (diffY > 100 && container.value?.scrollTop === 0) {
        updateOpen(false);
    }
};

let touchY = 0;

function handleTouchStart(e: TouchEvent) {
    touchY = e.touches[0].clientY;
}

function handleTouchMove(e: TouchEvent) {
    const currentY = e.changedTouches[0].clientY;
    const diffY = currentY - touchY;
    if (
        diffY < -100 &&
        scrollableContainer.value?.scrollTop ===
            scrollableContainer.value?.scrollHeight - window.innerHeight
    )
        updateOpen(true);
}

watch(container, (newVal, oldVal) => {
    newVal?.addEventListener("touchstart", drawerOnTouchStart);
    newVal?.addEventListener("touchend", drawerOnTouchMove);
    oldVal?.removeEventListener("touchstart", drawerOnTouchStart);
    oldVal?.removeEventListener("touchmove", drawerOnTouchMove);
});

const { scrollableContainer } = inject("scroll");
watch(scrollableContainer, (newVal, oldVal) => {
    newVal?.addEventListener("touchstart", handleTouchStart);
    newVal?.addEventListener("touchend", handleTouchMove);
    oldVal?.removeEventListener("touchstart", handleTouchStart);
    oldVal?.removeEventListener("touchmove", handleTouchMove);
});

onMounted(() => {
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
});

onBeforeUnmount(() => {
    container.value?.removeEventListener("touchstart", drawerOnTouchStart);
    container.value?.removeEventListener("touchmove", drawerOnTouchMove);

    scrollableContainer.value?.removeEventListener(
        "touchstart",
        handleTouchStart,
    );
    scrollableContainer.value?.removeEventListener(
        "touchmove",
        handleTouchMove,
    );
});
</script>

<template>
    <Teleport to="body">
        <MobileMenuBar />
    </Teleport>

    <Drawer v-model:open="open">
        <DrawerContent class="bg-mobile-background min-w-sm">
            <div
                ref="container"
                class="mt-4 flex flex-col items-center gap-5 overflow-y-auto px-5.5 pb-[calc(80px+var(--tg-safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))] text-center"
            >
                <MobileMiniProfile />
                <MobileCard />

                <div class="flex w-full flex-col gap-2.5">
                    <UButton
                        v-for="navItem in navigation"
                        :ui="{
                            trailingIcon: 'size-6',
                        }"
                        class="border-light-light-gray pointer-events-auto flex h-12 w-full justify-between border px-4"
                        trailing-icon="i-lucide-move-right"
                        variant="link"
                        @click="
                            () => {
                                updateOpen(false);
                                router.push(navItem.link);
                            }
                        "
                        >{{ navItem.name }}
                    </UButton>
                </div>
            </div>

            <MobileMenuBar class="!z-20" />
        </DrawerContent>
    </Drawer>
</template>
