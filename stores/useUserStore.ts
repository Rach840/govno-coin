import { defineStore } from "pinia";
import type { HTTPMethod } from "h3";

interface UserState {
    user?: User;
    loading: Promise<void>;
    govno: number;
    usd: number;
    token?: string;
    toRubExchange: number;
    toUsdtExchange: number;
}

export const useUserStore = defineStore("userStore", {
    state: (): UserState => ({
        loading: new Promise((_r) => {}),
        govno: 0,
        usd: 0,
        toRubExchange: 0,
        toUsdtExchange: 0,
    }),

    actions: {
        async refreshBalance() {
            if (!this.loading && this.user?.id) {
                try {
                    const config = useRuntimeConfig();

                    console.debug("token:", this.token);
                    console.debug("userID:", this.user.id);

                    const { data, status } = await useFetch<{
                        usd: string;
                        govno: string;
                        usd_to_rub: string;
                        usdt_price_to_one: string;
                    }>(`${config.public.apiUrl}/balance/get_balance`, {
                        method: "post",
                        body: { user_id: this.user?.id },
                        headers: new Headers({
                            Authorization: `Bearer ${this.token}`,
                        }),
                    });

                    if (status.value === "success" && data.value) {
                        this.usd = parseFloat(data.value.usd) || 0;
                        this.govno = parseFloat(data.value.govno) || 0;
                        this.toRubExchange =
                            parseFloat(data.value.usd_to_rub) || 0;
                        this.toUsdtExchange =
                            parseFloat(data.value.usdt_price_to_one) || 0;
                        localStorage.setItem("govno", data.value.govno);
                        localStorage.setItem("usd", data.value.usd);
                        localStorage.setItem(
                            "toRubExchange",
                            data.value.usd_to_rub,
                        );
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
            const response = await fetch(
                "https://tonapi.io/v2/rates?tokens=ton&currencies=usd",
            );
            const data = (await response.json()) as {
                rates: {
                    TON: {
                        prices: {
                            USD: number;
                        };
                    };
                };
            };
            if (
                !response.ok ||
                !data ||
                !(this.toRubExchange && this.toUsdtExchange)
            ) {
                console.error("Не удалось получить данные обмена USD");
                return null;
            }

            return {
                toTon:
                    num >= 0
                        ? (num / data?.rates.TON.prices.USD).toFixed(2)
                        : "0.00",
                toUsdt:
                    num >= 0 ? (num / this.toUsdtExchange).toFixed(2) : "0.00",
                toRub:
                    num >= 0 ? (num * this.toRubExchange).toFixed(2) : "0.00",
            };
        },

        async validateUser() {
            const config = useRuntimeConfig();
            const { data: userToken, status } = await useFetch<{
                token: string;
            }>(`${config.public.apiUrl}/auth/validate_user`, {
                method: "post",
                body: {
                    initData: window.Telegram?.WebApp?.initData,
                    initDataUnsafe: window.Telegram?.WebApp?.initDataUnsafe,
                },
            });

            if (status.value == "success") {
                console.debug("token:", userToken);

                this.token = userToken.value?.token;
                localStorage.setItem("token", userToken.value?.token ?? "");
            }
        },

        async fetchWithValidate(
            url: string,
            opt: { method?: HTTPMethod; body?: Record<string, any> },
            flag = false,
        ): Promise<{ data: unknown; status: string; statusCode: number }> {
            const config = useRuntimeConfig();
            console.debug("token:", this.token);

            const response = await fetch(`${config.public.apiUrl}${url}`, {
                method: opt.method,
                body: opt.body ? JSON.stringify(opt.body) : undefined,
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                }),
            });
            if (response.status == 401 && !flag) {
                await this.validateUser();
                return this.fetchWithValidate(url, opt, true);
            }
            return {
                data: await response.json(),
                status: response.ok ? "success" : "error",
                statusCode: response.status,
            };
        },

        setTestUser() {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                this.user = JSON.parse(userStr);
                this.loading = Promise.resolve();
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
            const userStr = localStorage.getItem("user");
            if (userStr) {
                this.user = JSON.parse(userStr);
                this.loading = Promise.resolve();
            } else {
                const userTelegram: UserResponse | undefined =
                    window.Telegram?.WebApp?.initDataUnsafe?.user;

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

        setUserLocal(userResponse: UserResponse) {
            const userMap = {
                id: userResponse.id,
                firstName: userResponse.first_name,
                lastName: userResponse.last_name,
                avatarUrl: userResponse.photo_url,
                userName: userResponse.username,
            };
            this.user = userMap;
            localStorage.setItem("user", JSON.stringify(userMap));

            this.loading = Promise.resolve();
        },
    },
});
