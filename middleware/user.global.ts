import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async () => {
   console.log("asdfasdfidhf;dhsakfjsdhafjhdsjlkfdjfh");

   const { setTestUser, refreshBalance, validateUser } = useUserStore();
   try {
      setTestUser();
      await validateUser()
      await refreshBalance();
   } catch (error) {}
});
