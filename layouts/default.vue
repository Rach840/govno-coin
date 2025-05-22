<template>
  <UApp>
    <SidebarProvider>

      <AdminSidebar  />
      <main class="w-full">

        <UContainer class="py-6">
          <slot />
        </UContainer>

      </main>
    </SidebarProvider>
  </UApp>
</template>
<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import AdminSidebar from "~/components/AdminSidebar.vue";

</script>