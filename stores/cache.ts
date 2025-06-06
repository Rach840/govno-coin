import { defineStore } from "pinia";

interface CacheState {
    news: News[] | null;
    newsLastDate: Date | null;
    tonExchange: number;
    tonExchangeDate?: Date;
}

export const useCacheStore = defineStore("cacheStore", {
    state: (): CacheState => ({
        news: null,
        newsLastDate: null,
        tonExchange: 0,
    }),

    actions: {
        async cacheNews() {
            const userStore = useUserStore();

            type ResponseData = {
                date: string;
                news: News[];
            };
            function generateRandomNumbers() {
                const firstNumber = Math.floor(Math.random() * 23) + 1;
                const secondNumber = Math.floor(Math.random() * 59) + 1;
                return [firstNumber, secondNumber];
            }

            const newsExist = localStorage.getItem("news");
            const newsDate = JSON.parse(localStorage.getItem("newsLastDate"));
            const now = new Date();

            console.log(newsDate);

            if (
                !newsDate ||
                now.getTime() - new Date(newsDate).getTime() >=
                    12 * 60 * 60 * 1000
            ) {
                const { data, status } = await userStore.fetchWithValidate(
                    "/news/get_news",
                    {
                        method: "POST",
                        body: {
                            user_id: userStore.user?.id,
                        },
                    },
                );
                console.log(data);

                if (status == "success") {
                    const dateResponse = (data as ResponseData).date;
                    this.news = (data as ResponseData).news
                        .map((item) => {
                            const [hours, min] = generateRandomNumbers();
                            const dateToDate = new Date(
                                Number(dateResponse?.split("-")[0]),
                                Number(dateResponse?.split("-")[1]) - 1,
                                Number(dateResponse?.split("-")[2]),
                                hours,
                                min,
                            )
                                .toLocaleString("ru-RU", {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: false,
                                })
                                ?.split(",")
                                ?.reverse()
                                ?.join(" ");

                            return {
                                ...item,
                                date: dateToDate,
                            };
                        })
                        .reverse();
                }
                localStorage.setItem("news", JSON.stringify(this.news));
                localStorage.setItem("newsLastDate", JSON.stringify(now));
                this.newsLastDate = now;
            } else {
                this.news = JSON.parse(newsExist);
                this.newsLastDate = now;
            }
        },
        async exchangeCache() {
            const tonExchangeExist = localStorage.getItem("ton");
            const tonExchangeDate = localStorage.getItem("tonDate");
            const now = new Date();

            console.log(tonExchangeDate);

            if (
                !tonExchangeDate ||
                now.getTime() - new Date(tonExchangeDate).getTime() >=
                    5 * 60 * 1000
            ) {
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
                this.tonExchange = JSON.parse(data?.rates.TON.prices.USD);
                this.tonExchangeDate = now;
                localStorage.setItem(
                    "ton",
                    JSON.stringify(data?.rates.TON.prices.USD),
                );
                localStorage.setItem("tonDate", JSON.stringify(now));
            } else {
                this.tonExchange = JSON.parse(tonExchangeExist);
                this.tonExchangeDate = now;
            }
        },
    },
});
