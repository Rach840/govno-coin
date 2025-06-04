import { defineStore } from "pinia";

export const useAdaptiveStore = defineStore("adaptiveStore", {
    state: () => ({
        viewport: ref({
            maxHeight: window?.visualViewport?.height,
            maxWidth: window?.visualViewport?.width,
            height: window?.visualViewport?.height,
            width: window?.visualViewport?.width,
        }),
    }),
    getters: {
        menuVisible(): boolean {
            return (
                (this.viewport?.maxHeight ?? 0) - 100 <=
                (this.viewport?.height ?? 0)
            );
        },
    },
    actions: {
        updateViewport() {
            this.viewport.height = window?.visualViewport?.height;
            this.viewport.width = window?.visualViewport?.width;
        },
        focus(e) {
            e.preventDefault();
            this.viewport.height = this.viewport.maxHeight;
        },
        focusScroll() {
            this.viewport.height = 0;

            setTimeout(() => {
                document.addEventListener("dblclick", this.focus);
            }, 500);
        },
        focusScrollUnlock() {
            document.removeEventListener("dblclick", this.focus);
        },
    },
});
