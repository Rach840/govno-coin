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
         }, 500);
      },
   },
});
if (import.meta.hot) {
   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
