<template>
   <div class="survey-container" id="content_app">
      <section v-if="surveyState == 1">
         <div class="mb-5 flex justify-between items-center">
            <h1 class="text-h1 lg:text-3xl font-semibold">Опрос</h1>
            <p class="text-xl text-(--support-text-color)">
               {{ currentQuestionIndex + 1 }} / 10
            </p>
         </div>
         <h3 class="text-h2 mb-5">
            {{
               questions.length > 0
                  ? questions[currentQuestionIndex]
                  : "Загрузка вопросов..."
            }}
         </h3>
         <UInput
            size="xl"
            :ui="{
               base: 'p-4 bg-transparent',
            }"
            @focus="focusScroll"
            variant="outline"
            color="secondary"
            v-model="userValue"
            class="w-full"
         />
         <UButton
            @click="nextQuestion"
            :disabled="userValue.trim() === ''"
            class="w-full flex justify-between mt-4"
            size="xxl"
            :ui="{}"
            trailing-icon="i-lucide-arrow-right"
         >
            Продолжить
         </UButton>
      </section>

      <section v-else-if="surveyState == 2" class="results-section">
         <h1 class="text-h1 lg:text-3xl font-semibold mb-5">Опрос</h1>
         <div class="results-content">
            <h3 class="text-h2 lg:text-2xl font-semibold">
               ✅ Опрос завершён!
            </h3>
            <p class="green-color my-5 text-h2 lg:text-2xl">
               +{{ correctAnswersGovno }} $GOVNO
               <span class="text-(--support-text-color) text-base lg:text-xl"
                  >~ {{ correctAnswersUsdt }} $USDT</span
               >
            </p>
            <div class="space-y-4">
               <p class="text-base">
                  Сегодня вы ответили правильно на {{ correctAnswersCount }} из
                  {{ questionsLength }} вопросов, приходите завтра!
               </p>
               <p class="text-(--support-text-color) text-sm">
                  Опросы обновляются ежедневно, за их прохождение вы сможете
                  заработать $GOVNO
               </p>
            </div>
         </div>
         <div class="absolute bottom-[120px] left-0 mx-[20px]">
            <img class="rounded-[10px]" src="/surveys/ad.svg" alt="" />
            <UButton
               to="/balance"
               class="w-full flex justify-between mt-4"
               size="xxl"
               :ui="{}"
               trailing-icon="i-lucide-arrow-right"
            >
               Перейти к заданиям
            </UButton>
         </div>
      </section>

      <section
         v-else-if="surveyState == 3"
         class="bg-[url(/surveys/background-mobile.svg)] md:bg-[url(/surveys/background-desktop.svg)] bg-size-[105vw_100vh] md:flex flex-col items-center justify-center absolute left-0 w-screen -top-8 h-screen padding-container"
      >
         <h2 class="text-h2 lg:!text-2xl mx-4 mt-5 lg:mb-4">
            ✅ Опросы на сегодня завершены!
         </h2>
         <div class="absolute lg:static bottom-[120px] left-0 mx-[20px]">
            <img class="rounded-[10px]" src="/surveys/ad.svg" alt="" />
            <UButton
               class="w-full flex justify-between mt-4"
               size="xxl"
               to="/balance"
               :ui="{}"
               trailing-icon="i-lucide-arrow-right"
            >
               Перейти к заданиям
            </UButton>
         </div>
      </section>
   </div>
   <Menu class="menu"></Menu>
   <div v-if="surveyState == 3" class="finished-section-background"></div>
</template>

<script setup lang="ts">
import axios from "axios";
definePageMeta({
   pageTransition: { name: "trans", mode: "default" },
});
const userValue = ref<string>("");
const surveyState = ref<number>(3);
const showFinishedMessage = ref<boolean>(false);
const currentQuestionIndex = ref<number>(0);
const questions = ref<string[]>([]);
const questionsLength = ref<number>(0);
const userAnswers = ref<string[]>([]);
const correctAnswersCount = ref<number>(0);
const correctAnswersUsdt = ref<number>(0);
const correctAnswersGovno = ref<number>(0);
const { user } = useUserStore();
const config = useRuntimeConfig();
const { focusScroll } = useAdaptiveStore();
const userId = user?.id;
const storageKey = `quiz_questions_${encodeURIComponent(userId)}`;

onMounted(async () => {
   const saved = localStorage.getItem(storageKey);
   console.log("fsdf", saved);

   if (saved) {
      try {
         const parsed = JSON.parse(saved);
         questions.value = parsed.questions || [];

         currentQuestionIndex.value = parsed.currentIndex || 0;
         userAnswers.value = parsed.answers || [];
         questionsLength.value = questions.value.length;

         if (currentQuestionIndex.value >= questions.value.length) {
            surveyState.value = 2;
         }
      } catch (e) {
         console.error("Ошибка при чтении данных из localStorage", e);
         await generateAndSaveQuestions();
      }
   } else {
      generateAndSaveQuestions();
   }
});

async function generateAndSaveQuestions() {
   try {
      const response = await axios.post(
         `${config.public.apiUrl}/quiz/get_questions`,
         { userId },
      );
      console.log(response.data);

      if (!(await checkQuestion())) return;

      if (response.status === 200 && response.data) {
         questions.value = response.data;
         console.log("sdafd", questions.value);
         questionsLength.value = questions.value.length;
         currentQuestionIndex.value = 0;
         userAnswers.value = [];

         saveProgress();
      }
   } catch (error) {
      surveyState.value = 3;
      console.error("Ошибка при получении вопросов", error);
   }
}

function saveProgress() {
   localStorage.setItem(
      storageKey,
      JSON.stringify({
         questions: questions.value,
         currentIndex: currentQuestionIndex.value,
         answers: userAnswers.value,
      }),
   );
}

async function nextQuestion() {
   if (userValue.value.trim() === "") {
      return;
   }

   userAnswers.value.push(userValue.value.trim());
   userValue.value = "";

   if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
      saveProgress();
   } else {
      surveyState.value = 2;
      await sendAnswers();
      localStorage.removeItem(storageKey);
   }
}
async function checkQuestion() {
   const { status } = await useFetch(
      `${config.public.apiUrl}/quiz/check_question`,
      {
         method: "post",
         body: {
            user_id: userId,
         },
      },
   );
   if (status.value == "success") {
      surveyState.value = 1;
      return true;
   } else {
      surveyState.value = 3;
      return false;
   }
}
async function sendAnswers() {
   try {
      const response = await axios.post(
         `${config.public.apiUrl}/quiz/validate-answers`,
         {
            userId,
            questions: questions.value,
            answers: userAnswers.value,
         },
      );

      if (response.status === 200) {
         correctAnswersCount.value = response.data.correctAnswersCount;
         correctAnswersUsdt.value = response.data.usdt;
         correctAnswersGovno.value = response.data.govno;
         localStorage.removeItem(storageKey);
      }
   } catch (error) {
      console.error("Ошибка при отправке ответов", error);
   }
}
</script>
