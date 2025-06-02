<script setup lang="ts">
const { updateOpen } = inject("open");
const menuVisible = computed(() => {
   return useAdaptiveStore().menuVisible;
});
console.log("asfddasdas", menuVisible.value);
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
    <transition
  name="fade-slide"
  mode="out-in"
>
   <div
      v-if="menuVisible"
      :class="`fixed bottom-0 left-0 w-full  gap-3 mt-14 bg-[#262827] rounded-t-2xl py-4 flex justify-center items-center z-20 ${fullPath == '/register/' ? 'hidden' : ''}`"
   >
      <UButton
         class="border-1 border-(--line-gray) size-[15vw] flex justify-center items-center"
         color="primary"
         variant="link"
         @click="() => (type == 'drawerMenu' ? updateOpen() : '')"
         to="/balance"
      >
         <img src="/menu/menu-balance.svg" class="w-7 h-6" preload />
      </UButton>
      <UButton
         class="bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)] size-[15vw] flex justify-center items-center"
         variant="link"
         v-for="button in otherButtons"
         @click="() => (type == 'drawerMenu' ? updateOpen() : '')"
      >
         <img :src="button.icon" class="w-10 h-10" preload />
      </UButton>

      <UButton
         class="border-1 pointer-events-auto border-(--line-gray) size-[15vw] flex justify-center items-center"
         variant="link"
         icon="i-lucide-ellipsis"
         @click="(e) => updateOpen(e)"
      />
   </div>
   </transition>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>