import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async () => {
   console.log("asdfasdfidhf;dhsakfjsdhafjhdsjlkfdjfh");

   const { setUser, refreshBalance, validateUser } = useUserStore();
   try {
      setUser();
      await validateUser();
      await refreshBalance();
   } catch (error) {}
});
