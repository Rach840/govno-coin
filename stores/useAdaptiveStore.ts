import { defineStore } from "pinia";

export const useAdaptiveStore = defineStore("adaptiveStore", {
    state: () => ({
        menuVisible: ref(true),
        focus: (e) => {
            e.preventDefault();
        },
    }),
    actions: {
        changeVisible() {
            this.menuVisible = !this.menuVisible;
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
