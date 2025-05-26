<script setup lang="ts">
const { updateOpen } = inject("open");
const otherButtons = [
   {
      link: "map",
      icon: "/menu/map.svg",
   },
   {
      link: "battle",
      icon: "/menu/battle.svg",
   },
   {
      link: "wallet",
      icon: "/menu/wallet.svg",
   },
];
</script>

<template>
   <div
      class="fixed bottom-0 left-0 w-full gap-x-4 mt-14 bg-[#262827] rounded-t-2xl py-4 flex justify-center items-center z-50"
   >
      <UButton color="primary" variant="outline" to="/balance" size="xxl">
         <img src="/menu/menu-balance.svg" class="w-7 h-6" />
      </UButton>
      <UButton
         color="gradient"
         variant="solid"
         :to="`/${button.link}`"
         size="xxs"
         v-for="button in otherButtons"
      >
         <img :src="button.icon" class="w-10 h-10" />
      </UButton>

      <UButton
         color="primary"
         variant="outline"
         icon="i-lucide-ellipsis"
         @click="updateOpen"
         class=""
         size="xxl"
      />
   </div>
</template>

<style scoped></style>
