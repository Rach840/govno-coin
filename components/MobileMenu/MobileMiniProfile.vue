<script setup lang="ts">
const { user } = useUserStore();
console.log(user);
</script>

<template>
  <div class="flex gap-x-5 items-center justify-center w-full py-4">
    <img :src="user.avatarUrl" class="rounded-full size-16" alt="" />

    <div class="flex flex-col gap-1">
      <h4 class="text-2xl font-bold text-white">
        {{ user.firstName }} {{ user.lastName }} 🚀
      </h4>
      <span
        class="text-(length--support-text) text-(--support-text-color) text-left"
      >
        {{ user.lastName }}
      </span>
    </div>
  </div>
</template>
