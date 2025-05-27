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
   <div class="fixed bottom-0 left-0 w-full gap-3 mt-14 bg-[#262827] rounded-t-2xl py-4 flex justify-center items-center z-50">
      <UButton class="border-1 border-(--line-gray) size-[15vw] flex justify-center items-center" color="primary" variant="link" to="/balance"><img src="/menu/menu-balance.svg" class="w-7 h-6" /></UButton>
      <UButton
         class="bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)] size-[15vw] flex justify-center items-center"
         variant="link"
         :to="`/${button.link}`"
         v-for="button in otherButtons"
      >
         <img :src="button.icon" class="w-10 h-10" />
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
