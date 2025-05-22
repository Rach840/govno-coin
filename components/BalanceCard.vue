<template>
  <div class="flex flex-col gap-1">
    <p class=" text-(--support-text) text-(--support-text-color)"><slot name="title"></slot></p>
    <div class="flex flex-col gap-0.5">
      <p class="text-h0 font-bold text-white"> $ <slot name="valueUSD" ></slot> </p>
      <span class=" text-(--support-text) text-(--support-text-color)"> ~ <slot name="valueGovno" ></slot> $GOVNO </span>
    </div>
  </div>
</template>
<script setup lang="ts">

</script>