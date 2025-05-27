import { log } from "console";
import { defineStore } from "pinia";

interface UserState {
   user: User | null;
   loading: boolean;
}

export const useUserStore = defineStore("telegramStore", {
   state: (): UserState => ({
      user: null,
      loading: true,
   }),

   actions: {
      isReady() {
         this.loading = true;
         return window?.Telegram?.WebApp?.ready();
      },
      setTestUser() {
         if (localStorage.getItem("user")) {
            const userExist = JSON.parse(localStorage.getItem("user"));
            this.user = userExist;
            this.loading = false;
         } else {
            this.setUserLocal({
               id: 1029163005,
               first_name: "Ceme4k1n",
               last_name: "",
               photo_url:
                  "https://t.me/i/userpic/320/-3eDcd5ufqnc25oT0huvTeLupzbaU-RhQPLMtOVQz14.svg",
               username: "Ceme4kin",
            });
         }
      },
      setUser() {
         if (localStorage.getItem("user")) {
            console.log("localstorage exist user");

            const userExist = JSON.parse(localStorage.getItem("user"));
            this.user = userExist;
            this.loading = false;
         } else {
            console.log("localstorage  dont exist user");
            const userTelegram: UserResp =
               window.Telegram?.WebApp?.initDataUnsafe?.user;
            console.log("dfasdfsf", userTelegram);

            if (userTelegram)
               this.setUserLocal({
                  id: userTelegram.id,
                  first_name: userTelegram.first_name,
                  last_name: userTelegram.last_name,
                  username: userTelegram.username,
                  photo_url: userTelegram.photo_url,
               });
         }
      },
      checkUser() {
         return localStorage.getItem("user") ? true : false;
      },
      setUserLocal(userResp: UserResp) {
         console.log("asdasd", userResp);
         const userMap = {
            id: userResp.id,
            firstName: userResp.first_name,
            lastName: userResp.last_name,
            avatarUrl: userResp.photo_url,
            userName: userResp.username,
         };
         this.user = userMap;
         localStorage.setItem("user", JSON.stringify(userMap));

         this.loading = false;
         console.log("sdfsaf", this.loading);
      },
   },
});
if (import.meta.hot) {
   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
