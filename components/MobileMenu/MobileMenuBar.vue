<script setup lang="ts">
const { updateOpen } = inject("open");

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
   <div
      :class="`absolute bottom-0 left-0 w-full  gap-3 mt-14 bg-[#262827] rounded-t-2xl py-4 flex justify-center items-center z-50 ${fullPath == '/register/' ? 'hidden' : ''}`"
   >
      <UButton
         class="border-1 border-(--line-gray) size-[15vw] flex justify-center items-center"
         color="primary"
         variant="link"
         @click="() => (type == 'drawerMenu' ? updateOpen() : '')"
         to="/balance"
      >
         <NuxtImg src="/menu/menu-balance.svg" class="w-7 h-6" preload />
      </UButton>
      <UButton
         class="bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)] size-[15vw] flex justify-center items-center"
         variant="link"
         v-for="button in otherButtons"
         @click="() => (type == 'drawerMenu' ? updateOpen() : '')"
      >
         <NuxtImg :src="button.icon" class="w-10 h-10" preload />
      </UButton>

      <UButton
         class="border-1 border-(--line-gray) size-[15vw] flex justify-center items-center"
         variant="link"
         icon="i-lucide-ellipsis"
         @click="updateOpen"
      />
   </div>
</template>

<style scoped></style>
