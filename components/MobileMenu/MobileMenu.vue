<script setup lang="ts">
import { ref } from "vue";
import MobileMenuBar from "./MobileMenuBar.vue";
import MobileMiniProfile from "~/components/MobileMenu/MobileMiniProfile.vue";
import MobileCard from "~/components/MobileMenu/MobileCard.vue";
import { templateRef } from "@vueuse/core";

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
const { menuVisible } = useAdaptiveStore();
console.log("asfddasdas", menuVisible.value);
const { fullPath } = useRoute();
console.log(fullPath);
const menu = templateRef<HTMLDivElement>("menu");
</script>

<template>
   <div :class="` ${open ? 'h-[120px]' : 'h-screen'} duration-500 bottom-0 w-full fixed left-0 overflow-hidden`">
<MobileMenuBar v-if="menuVisible" />

   <div
      ref="menu"
      :class="`absolute overflow-hidden   ${open ? '-bottom-[650px]' : 'bottom-0'} duration-500 bg-[#262827]  w-full left-0 rounded-t-3xl z-20`"
   >
      <div class="pt-4 mb-7">
         <div
            class="h-[10px] w-[70px] !bg-[#737373] rounded-full mx-auto"
         ></div>
      </div>
      <div
         class="px-5.5 flex flex-col items-center text-center gap-5 overflow-auto mt-4"
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
               @click="updateOpen"
               trailing-icon="i-lucide-move-right"
               :to="navItem.link"
               v-for="navItem in navigation"
               variant="link"
               >{{ navItem.name }}</UButton
            >
         </div>
      </div>
   </div>

   </div>
   

   <!-- <UDrawer
      v-model:open="open"
      :portal="true"
      :modal="true"
      side="bottom"
      class="absolute z-10"
      overlay-class="bg-black/40"
      :ui="{
         content:
            '!bg-[#262827]  !ring-transparent !rounded-t-4xl px-auto pt-4',
         handle: [
            ' m-0 py-[0.1vw]   px-[9vw] !bg-[#737373] ',
            '  transition-opacity  ',
         ],
         header: 'bg-[#262827] ',
         overlay: 'bg-black/40 ',
      }"
      :transition="{
         enterActiveClass: 'duration-300',
         leaveActiveClass: 'duration-200',
      }"
   > -->

   <!-- </UDrawer> -->
</template>
