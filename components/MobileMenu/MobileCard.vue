<template>
  <UCard variant="solid" class="w-full">
    <div class="flex flex-col gap-y-6  w-full">
      <div class="flex items-center justify-between gap-6">
      <div class="flex flex-col gap-0.5">
        <p class="text-h0 font-bold text-white"> $ <slot name="valueUSD" ></slot> </p>
        <span class=" text-left text-(length--support-text) text-(--support-text-color)"> ~ <slot name="valueGovno" ></slot> $GOVNO </span>
      </div>
      <UButton
          color="primary"
          variant="outline"
          to="/balance"
          size="xxl"
      >
        <img src="/menu/menu-balance.svg" class="w-7 h-6" alt="">
      </UButton>
      </div>

      <UButton
          color="info"
          variant="solid"
          class="w-full flex justify-between"
          to="/balance"
          size="xxl"
          trailing-icon="i-lucide-circle-plus"
      >
        Пополнить баланс
      </UButton>
    </div>
  </UCard>
</template>
<script setup lang="ts">
</script>