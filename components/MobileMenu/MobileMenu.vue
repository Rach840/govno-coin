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
    <Drawer v-model:open="open" class="bg-[#262827]">
        <DrawerContent>
            <div
                class="mt-4 flex flex-col items-center gap-5 overflow-auto px-5.5 text-center"
            >
                <MobileMiniProfile />
                <MobileCard
                    class="rounded-[5.3vw] bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)]"
                />

                <div class="mb-9 flex w-full flex-col gap-2.5">
                    <UButton
                        v-for="navItem in navigation"
                        :ui="{
                            trailingIcon: 'size-6',
                        }"
                        class="pointer-events-auto flex h-[12.6vw] w-full justify-between border-1 border-(--line-gray) bg-none px-4"
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
