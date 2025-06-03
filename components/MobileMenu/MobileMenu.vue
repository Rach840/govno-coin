<script lang="ts" setup>
import MobileMiniProfile from "~/components/MobileMenu/MobileMiniProfile.vue";
import MobileCard from "~/components/MobileMenu/MobileCard.vue";
import { Drawer, DrawerContent } from "~/components/ui/drawer";

const open = ref<boolean>(false);
const updateOpen = () => (open.value = !open.value);
provide("open", {
    open,
    updateOpen,
});

const navigation = [
    {
        name: "Задания",
        link: "/tasks",
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
        link: "/partners",
    },
];

const router = useRouter();
</script>

<template>
    <MobileMenuBar />
    <Drawer v-model:open="open">
        <DrawerContent class="bg-mobile-background min-w-sm">
            <div
                class="mt-4 flex flex-col items-center gap-5 overflow-auto px-5.5 text-center"
            >
                <MobileMiniProfile />
                <MobileCard />

                <div class="mb-9 flex w-full flex-col gap-2.5">
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
                                updateOpen();
                                router.push(navItem.link);
                            }
                        "
                        >{{ navItem.name }}
                    </UButton>
                </div>
            </div>
        </DrawerContent>
    </Drawer>
</template>
