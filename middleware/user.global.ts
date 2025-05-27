import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async () => {
   console.log("asdfasdfidhf;dhsakfjsdhafjhdsjlkfdjfh");

   const { setTestUser, refreshBalance } = useUserStore();
   try {
      console.log("asdfasdfidhf;dhsakfjsdhafjhdsjlkfdjfh");

      setTestUser();
      await refreshBalance();
   } catch (error) {}
});
