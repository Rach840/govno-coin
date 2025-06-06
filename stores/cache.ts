import { defineStore } from "pinia";

interface CacheState {
    news: News[] | null;
    newsLastDate: Date | null;
}

export const useCacheStore = defineStore("cacheStore", {
    state: (): CacheState => ({
        news: null,
        newsLastDate: null,
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
                this.newsLastDate = newsDate;
            }
        },
    },
});
