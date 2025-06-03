<script lang="ts" setup>
import { mockNews } from "~/lib/mockData";

const news = ref<News[]>(mockNews);
const _date = ref<Date>(new Date());
const dateFormat = computed(() => {
    return _date.value
        ?.toLocaleString("ru-RU", {
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
});

const { user, fetchWithValidate } = useUserStore();

function generateRandomNumbers() {
    const firstNumber = Math.floor(Math.random() * 23) + 1;
    const secondNumber = Math.floor(Math.random() * 59) + 1;
    return [firstNumber, secondNumber];
}

watchEffect(async () => {
    const { data, status } = await fetchWithValidate("/news/get_news", {
        method: "POST",
        body: {
            user_id: user?.id,
        },
    });

    type ResponseData = {
        date: string;
        news: News[];
    };

    if (status == "success") {
        const dateResponse = (data as ResponseData).date;
        news.value = (data as ResponseData).news
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
});
</script>

<template>
    <div class="flex flex-col items-center justify-start gap-7">
        <!-- Заголовок страницы -->
        <p class="text-h1 w-full text-start font-semibold">Новости</p>

        <!-- Контейнер для всех новостей -->
        <div
            class="gap flex w-full flex-col items-center justify-center space-y-4"
        >
            <!-- Карточка новости -->
            <NewsCard
                v-for="(item, index) in news"
                :key="index"
                :date="dateFormat"
                :news="item"
            />
        </div>
    </div>
</template>
