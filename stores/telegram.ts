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
          id: 1029163003,
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
        const userExist = JSON.parse(localStorage.getItem("user"));
        this.user = userExist;
      } else {
        const userTelegram: UserResp =
          window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
        if (userTelegram) this.setUserLocal(userTelegram);
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
    },
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
