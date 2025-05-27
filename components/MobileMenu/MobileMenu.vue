<script setup lang="ts">
import { ref } from "vue";
import MobileMenuBar from "./MobileMenuBar.vue";
import MobileMiniProfile from "~/components/MobileMenu/MobileMiniProfile.vue";
import MobileCard from "~/components/MobileMenu/MobileCard.vue";

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

const { fullPath } = useRoute();
console.log(fullPath);
</script>

<template>
   <MobileMenuBar v-if="fullPath != '/' || fullPath != '/register'" />

   <UDrawer
      v-model:open="open"
      :portal="true"
      :modal="true"
      side="bottom"
      overlay-class="bg-black/40"
      :ui="{
         content: '!bg-[#262827] !rounded-t-4xl px-auto pt-4',
         handle: [
            ' m-0 py-[0.1vw]  px-[9vw] !bg-[#737373] ',
            '  transition-opacity',
         ],
         header: 'bg-[#262827]',
      }"
      :transition="{
         enterActiveClass: 'duration-300',
         leaveActiveClass: 'duration-200',
      }"
   >
      <template #content>
         <div
            class="px-5.5 bg-[#262827] flex flex-col items-center text-center gap-5 overflow-auto mt-4"
         >
            <MobileMiniProfile />
            <MobileCard
               class="bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)] rounded-[5.3vw]"
            />

            <div class="flex flex-col gap-2.5 w-full mb-9">
               <UButton
                  class="w-full flex justify-between h-[12.6vw] px-4 bg-none border-1 border-(--line-gray)"
                  :ui="{
                     trailingIcon: 'size-6',
                  }"
                  trailing-icon="i-lucide-move-right"
                  :to="navItem.link"
                  v-for="navItem in navigation"
                  variant="link"
                  >{{ navItem.name }}</UButton
               >
            </div>
            <MobileMenuBar />
         </div>
      </template>
   </UDrawer>
</template>
