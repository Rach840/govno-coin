import { defineStore } from "pinia";

export const useAdaptiveStore = defineStore("adaptiveStore", {
      state: () => ({
menuVisible: ref(true),
   }),
   actions: {
changeVisible(){

},
      focusScroll() {
         this.menuVisible = false
          console.log('asda',this.menuVisible);
          
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
       this.menuVisible = true
         console.log('asdf',this.menuVisible);
         
         document.removeEventListener("dblclick", (e) => {});
      },
   },
});
if (import.meta.hot) {
   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
