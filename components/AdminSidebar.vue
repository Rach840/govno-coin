<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarFooter } from "~/components/ui/sidebar";

const items = [
  {
    title: "Главная",
    url: "/balance",
    icon: "i-lucide-house",
  },
  {
    title: "Категории",
    url: "/balance",
    icon: "i-lucide-book-heart",
  },
  {
    title: "Доктора",
    url: "/balance",
    icon: "i-lucide-users",
  },
  {
    title: "Записи",
    url: "/balance",
    icon: "i-lucide-file-text",
  },
  {
    title: "Пользователи",
    url: "/balance",
    icon: "i-lucide-users",
  },
];
const {fullPath} = useRoute();
console.log(fullPath)
</script>

<template>
  <Sidebar class="rounded-br-[40px] overflow-hidden" v-if="fullPath != '/'" collapsible="icon">
    <SidebarContent class="rounded-br-[40px]">
      <SidebarTrigger />
      <SidebarGroup>
        <SidebarGroupLabel class="py-8">
          <div class="mx-auto border-b">
            <NuxtLink href="/" class="flex items-center gap-2"> </NuxtLink>
          </div>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="py-14 px-4">
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <UButton
                :icon="item.icon"
                :to="item.url"
                variant="link"
                size="xl"
                class="text-xl"
              >
                {{ item.title }}</UButton
              >
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <UPopover
            :ui="{
              content: 'w-full',
            }"
            class="w-full"
          >
            <UButton
              size="xl"
              color="neutral"
              variant="subtle"
              class="cursor-pointer w-full text-xl"
            >
            </UButton>
            <template #content>
              <div class="w-full px-6 py-2">
                <UButton
                  size="xl"
                  variant="link"
                  to="/"
                  color="primary"
                  class="cursor-pointer w-full text-xl"
                >
                  Выйти на сайт
                </UButton>
              </div>
            </template>
          </UPopover>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
<style></style>
