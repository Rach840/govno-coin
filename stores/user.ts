import { defineStore } from "pinia";
import type { ComputedOptions } from "vue";

interface UserState {
   user: User | null;
   loading: boolean;
   govno: number;
   usd: number;
   token: string | null;
   toRubExchange: number;
   toUsdtExchange: number;
}

export const useUserStore = defineStore("telegramStore", {
   state: (): UserState => ({
      user: null,
      loading: true,
      govno: 0,
      usd: 0,
      token: null,
      toRubExchange: 0,
      toUsdtExchange: 0,
   }),

   actions: {
      isReady() {
         this.loading = true;
         return window?.Telegram?.WebApp?.ready();
      },
      async refreshBalance() {
         if (!this.loading && this.user?.id) {
            try {
               const config = useRuntimeConfig();
               console.log("balance", this.token);
               console.log("balance", this.user.id);

               const { data, status } = await useFetch(
                  `${config.public.apiUrl}/balance/get_balance`,
                  {
                     method: "post",
                     body: { user_id: this.user?.id },
                     headers: new Headers({
                        Authorization: `Bearer ${this.token}`,
                     }),
                  },
               );
               console.log(data.value);

               if (status.value === "success" && data.value) {
                  this.usd = parseFloat(data.value.usd) || 0;
                  this.govno = parseFloat(data.value.govno) || 0;
                  this.toRubExchange = parseFloat(data.value.usd_to_rub) || 0;
                  this.toUsdtExchange =
                     parseFloat(data.value.usdt_price_to_one) || 0;
                  localStorage.setItem("govno", data.value.govno);
                  localStorage.setItem("usd", data.value.usd);
                  localStorage.setItem("toRubExchange", data.value.usd_to_rub);
                  localStorage.setItem(
                     "toUsdtExchange",
                     data.value.usdt_price_to_one,
                  );
               }
            } catch (error) {
               console.error("Ошибка при получении баланса ❌", error);
            }
         }
      },
      async calcUsdExchange(
         num: number,
      ): Promise<Record<string, string> | null> {
         const { data } = await useFetch(
            "https://tonapi.io/v2/rates?tokens=ton&currencies=usd",
         );
         if (this.toRubExchange && this.toUsdtExchange) {
            return {
               toTon:
                  num >= 0
                     ? (num / data.value?.rates.TON.prices.USD).toFixed(2)
                     : "0.00",
               toUsdt:
                  num >= 0 ? (num / this.toUsdtExchange).toFixed(2) : "0.00",
               toRub: num >= 0 ? (num * this.toRubExchange).toFixed(2) : "0.00",
            };
         }
         return null;
      },
      async validateUser() {
         const config = useRuntimeConfig();
         const { data: userToken, status } = await useFetch(
            `${config.public.apiUrl}/auth/validate_user`,
            {
               method: "post",
               body: {
                  initData: window.Telegram?.WebApp?.initData,
                  initDataUnsafe: window.Telegram?.WebApp?.initDataUnsafe,
               },
            },
         );
         if (status.value == "success") {
            console.log(userToken);

            this.token = userToken.value?.token;
            localStorage.setItem("token", userToken.value?.token);
         }
      },
      async fetchWithValidate(
         url: string,
         opt: { method; body?: Record<string, any> },
      ) {
         const config = useRuntimeConfig();
         console.log(this.token);

         const response = await useFetch(`${config.public.apiUrl}${url}`, {
            ...opt,
            headers: new Headers({
               Authorization: `Bearer ${this.token}`,
            }),
         });
         if (response.error.value?.statusCode == 401) {
            await this.validateUser();
            response.refresh();
         }
         return response;
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
