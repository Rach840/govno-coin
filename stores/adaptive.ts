import { defineStore } from "pinia";

export const useAdaptiveStore = defineStore("adaptiveStore", {
    state: () => ({
        menuVisible: ref(true),

        viewport: ref({
            maxHeight: window?.visualViewport?.height,
            maxWidth: window?.visualViewport?.width,
        }),

        focus: (e) => {
            e.preventDefault();
        },
    }),
    actions: {
        changeVisible() {
            this.menuVisible = !this.menuVisible;
        },

        updateViewport() {
            this.viewport.height = window?.visualViewport?.height;
            this.viewport.width = window?.visualViewport?.width;
        },

        focusScroll() {
            this.menuVisible = false;
            setTimeout(() => {
                document.addEventListener("dblclick", this.focus);
            }, 500);
        },
        focusScrollUnlock() {
            this.menuVisible = true;
            document.removeEventListener("dblclick", this.focus);
        },
    },
});
