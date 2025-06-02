import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async () => {
   console.log("asdfasdfidhf;dhsakfjsdhafjhdsjlkfdjfh");

   const { user,toRubExchange, token,setUser,validateUser, refreshBalance,  } = useUserStore();
   try {
      if (!user && !token && !toRubExchange) {
      setUser();
      await validateUser();
      await refreshBalance();  
      }  else{
      await refreshBalance();  

      }
   } catch (error) {}
});
