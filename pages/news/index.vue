<template>
   <div class="flex flex-col items-center justify-start gap-7">
      <!-- Заголовок страницы -->
      <p class="w-full text-h2 font-semibold text-start">Новости</p>

      <!-- Контейнер для всех новостей -->
      <div
         class="flex flex-col justify-center space-y-4 items-center gap w-full"
      >
         <!-- Карточка новости -->
         <NewsCard
            :news="item"
            v-for="(item, index) in news"
            :date="dateFormat"
            :key="index"
         />
      </div>
   </div>
</template>

<script setup lang="ts">
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
console.log("df", news);
function generateRandomNumbers() {
   const firstNumber = Math.floor(Math.random() * 23) + 1;
   const secondNumber = Math.floor(Math.random() * 59) + 1;
   return [firstNumber, secondNumber];
}
watchEffect(async () => {
   const { data, status } = await fetchWithValidate("/news/get_news", {
      method: "post",
      body: {
         user_id: user?.id,
      },
   });
   console.log(status.value);

   if (status.value == "success") {
      const dateResp = data.value?.date;

      news.value = data.value?.news
         .map((item) => {
            const [hours, min] = generateRandomNumbers();
            console.log(hours, min);
            const dateToDate = new Date(
               dateResp?.split("-")[0],
               dateResp?.split("-")[1] - 1,
               dateResp?.split("-")[2],
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
