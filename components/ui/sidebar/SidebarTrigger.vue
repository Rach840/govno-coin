<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useSidebar } from "./utils";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();

const { toggleSidebar } = useSidebar();
</script>

<template>
    <Button
        :class="cn('size-12', props.class)"
        data-sidebar="trigger"
        data-slot="sidebar-trigger"
        size="icon"
        variant="ghost"
        @click="toggleSidebar"
    >
        <img alt="" class="" src="/menu/bit-expand-menu.svg" />
        <span class="sr-only">Toggle Sidebar</span>
    </Button>
</template>
