import { useUserStore } from "~/stores/telegram";

export default defineNuxtRouteMiddleware(async () => {
   console.log("asdfasdfidhf;dhsakfjsdhafjhdsjlkfdjfh");

   const { setUser } = useUserStore();
   try {
      console.log("asdfasdfidhf;dhsakfjsdhafjhdsjlkfdjfh");

      setUser();
   } catch (error) {}
});
