<script lang="ts" setup>
const user = useUserStore();
await user.loading;
</script>

<template>
    <UContainer class="padding-container mx-auto pb-[100px] lg:hidden">
        <slot />
    </UContainer>
    <!-- <SidebarProvider v-else>
      <AdminSidebar />
      <main class="w-full">
         <UContainer
            ref="container"
            class="padding-container mx-auto w-[80vw] py-6"
         >
            <slot />
         </UContainer>
      </main>
   </SidebarProvider> -->
    <main class="hidden w-full lg:block">
        <UContainer
            ref="container"
            class="padding-container mx-auto w-[80vw] py-6"
        >
            <h1 class="text-center text-6xl text-white">
                Данное приложение пока работает только в мобильном режиме
            </h1>
        </UContainer>
    </main>
</template>

<style>
.trans-enter-active,
.trans-leave-active {
    transition: all 0.4s;
}

.trans-enter-from,
.trans-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>
