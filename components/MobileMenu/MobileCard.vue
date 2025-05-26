<template>
   <UCard variant="solid" class="w-full">
      <div class="w-full flex flex-col gap-4 items-start justify-start">
         <div class="flex flex-col gap-0">
            <p class="text-(length:--h0) font-semibold text-white">
               $ <slot name="valueUSD"></slot>
            </p>
            <span class="text-left text-(length:--support-text) text-(--support-text-color) font-[100]">
               ~ <slot name="valueGovno"></slot> $GOVNO
            </span>
         </div>
         <UButton class="w-full flex justify-between bg-(--main-blue) h-[12.6vw] font-medium px-3.5" to="/balance" trailing-icon="i-lucide-circle-plus">Пополнить баланс</UButton>
      </div>
   </UCard>
</template>

<script setup lang="ts"></script>
