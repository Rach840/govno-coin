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
            this.menuVisible = true;
        },
        focusScroll() {
            this.menuVisible = true;

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
