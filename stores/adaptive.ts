import { defineStore } from "pinia";

export const useAdaptiveStore = defineStore("adaptiveStore", {
   state: () => ({
      menuVisible: ref(true),
   }),
   actions: {
      changeVisible() {
         this.menuVisible = !this.menuVisible;
      },
      focusScroll() {
         this.menuVisible = false;
         console.log("asda", this.menuVisible);

         setTimeout(() => {

            // window.scrollTo({
            //    top: scrollTarget,
            //    behavior: "smooth",
            // });
            document.addEventListener("dblclick", (e) => {
  
               e.preventDefault();
            });
         }, 500);
      },
      focusScrollUnlock() {
         this.menuVisible = true;
         document.removeEventListener("dblclick", (e) => {});
      },
   },
});
if (import.meta.hot) {
   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
