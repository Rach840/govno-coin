<script setup lang="ts">
import { ref } from "vue";
import MobileMenuBar from "./MobileMenuBar.vue";
import MobileMiniProfile from "~/components/MobileMenu/MobileMiniProfile.vue";
import MobileCard from "~/components/MobileMenu/MobileCard.vue";
import { templateRef } from "@vueuse/core";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
const open = ref(false);
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
const { fullPath } = useRoute();
console.log(fullPath);
const menu = templateRef<HTMLDivElement>("menu");
</script>

<template>
   <MobileMenuBar/>
   <Drawer class="bg-[#262827]" v-model:open="open">
      <DrawerContent>
         <div
            class="px-5.5 flex flex-col items-center text-center gap-5 overflow-auto mt-4"
         >
            <MobileMiniProfile />
            <MobileCard
               class="bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)] rounded-[5.3vw]"
            />

            <div class="flex flex-col gap-2.5 w-full mb-9">
               <UButton
                  class="w-full pointer-events-auto flex justify-between h-[12.6vw] px-4 bg-none border-1 border-(--line-gray)"
                  :ui="{
                     trailingIcon: 'size-6',
                  }"
                  @click="
                     () => {
                        updateOpen();
                        router.push(navItem.link);
                     }
                  "
                  trailing-icon="i-lucide-move-right"
                  v-for="navItem in navigation"
                  variant="link"
                  >{{ navItem.name }}</UButton
               >
            </div>
         </div>
      </DrawerContent>
   </Drawer>

</template>
