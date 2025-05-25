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
    link: "/quis",
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
</script>
<template>
  <MobileMenuBar />

  <UDrawer
    v-model:open="open"
    :portal="true"
    :modal="true"
    side="bottom"
    class="!rounded-t-2xl"
    overlay-class="bg-black/40"
    :ui="{
      content: '!bg-[#262827] px-auto pt-4',
      handle: ['bg-[#262827] m-0 py-1', 'transition-opacity'],
      header: 'bg-[#262827] py-4',
    }"
    :transition="{
      enterActiveClass: 'duration-300',
      leaveActiveClass: 'duration-200',
    }"
  >
    <template #content>
      <div
        class="px-6 bg-[#262827] py-2 space-y-4 flex flex-col items-center text-center"
      >
        <MobileMiniProfile />
        <MobileCard>
          <template #valueUSD>47 397</template>
          <template #valueGovno>61</template>
        </MobileCard>
        <div class="space-y-3 w-full">
          <UButton
            class="w-full flex justify-between"
            size="xxl"
            :ui="{
              trailingIcon: 'size-6',
            }"
            trailing-icon="i-lucide-move-right"
            :to="navItem.link"
            v-for="navItem in navigation"
            color="primary"
            variant="outline"
            >{{ navItem.name }}</UButton
          >
        </div>
        <MobileMenuBar />
      </div>
    </template>
  </UDrawer>
</template>
