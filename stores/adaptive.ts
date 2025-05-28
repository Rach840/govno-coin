import { defineStore } from "pinia";

export const useAdaptiveStore = defineStore("adaptiveStore", {
   actions: {
      focusScroll() {
         setTimeout(() => {
            const scrollTarget = Math.max(
               document.documentElement.scrollHeight,
               document.body.scrollHeight,
            );
            window.scrollTo({
               top: scrollTarget,
               behavior: "smooth",
            });
            document.addEventListener("dblclick", (e) => {
               window.scrollTo({
                  top: scrollTarget,
                  behavior: "instant",
               });
               e.preventDefault();
            });
         }, 500);
      },
      focusScrollUnlock() {
         document.removeEventListener("dblclick", (e) => {});
      },
   },
});
if (import.meta.hot) {
   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
