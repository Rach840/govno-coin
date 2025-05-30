<script setup lang="ts">
const { user } = useUserStore();
console.log(user);
</script>

<template>
   <div class="w-full flex items-center justify-start gap-3.5">
      <NuxtImg
         :src="user.avatarUrl"
         class="rounded-full size-[14vw]"
         alt=""
         preload
      />
      <div class="flex flex-col gap-[0.5vw]">
         <h4 class="text-(length:--h3) font-[100] text-white">
            {{ user.firstName }} 🚀
         </h4>
         <span class="text-(length:--h5) text-(--support-text-color) text-left">
            {{ user.lastName }}
         </span>
      </div>
   </div>
</template>
