<template>
    <div id="content_app" class="survey-container">
        <section v-if="surveyState == 1" class="">
            <div class="mb-5 flex items-center justify-between">
                <h1 class="text-3xl font-semibold lg:text-3xl">Опрос</h1>
                <p class="text-support text-xl">
                    {{ currentQuestionIndex + 1 }} / 10
                </p>
            </div>
            <h3 class="mb-5 text-2xl">
                {{
                    questions.length > 0
                        ? questions[currentQuestionIndex]
                        : "Загрузка вопросов..."
                }}
            </h3>
            <UInput
                v-model="userValue"
                :ui="{
                    base: 'p-4 border-light-light-gray',
                }"
                class="text-support border-light-light-gray w-full"
                size="xl"
                variant="outline"
                @focus="
                    isInputFocused = true;
                    focusScroll();
                "
                @focusout="
                    isInputFocused = false;
                    focusScrollUnlock();
                "
            />
            <UButton
                :disabled="userValue.trim() === ''"
                :ui="{}"
                class="pointer-events-auto mt-4 flex w-full justify-between bg-white text-black"
                size="xxl"
                trailing-icon="i-lucide-move-right"
                @click="nextQuestion"
            >
                Продолжить
            </UButton>

            <div class="pointer-events-none left-0 mx-auto mt-[220px]">
                <img
                    alt=""
                    class="w-full rounded-[10px]"
                    src="/surveys/ad.svg"
                />
            </div>
        </section>

        <section v-else-if="surveyState == 2" class="results-section">
            <h1 class="mt-8 mb-5 text-3xl font-semibold lg:text-3xl">Опрос</h1>
            <div class="results-content">
                <h3 class="text-2xl font-semibold lg:text-2xl">
                    ✅ Опрос завершён!
                </h3>
                <p class="green-color my-5 text-2xl lg:text-2xl">
                    +{{ correctAnswersGovno }} $GOVNO
                    <span class="text-support text-base lg:text-xl"
                        >~ {{ correctAnswersUsdt }} $USDT</span
                    >
                </p>
                <div class="space-y-4">
                    <p class="text-base">
                        Сегодня вы ответили правильно на
                        {{ correctAnswersCount }} из
                        {{ questionsLength }} вопросов, приходите завтра!
                    </p>
                    <p class="text-support text-sm">
                        Опросы обновляются ежедневно, за их прохождение вы
                        сможете заработать $GOVNO
                    </p>
                </div>
            </div>
            <div class="absolute bottom-[220px] left-0 mx-[20px]">
                <img
                    alt=""
                    class="w-full rounded-[10px]"
                    src="/surveys/ad.svg"
                />
                <UButton
                    :ui="{}"
                    class="mt-4 flex w-full justify-between bg-white text-black"
                    size="xxl"
                    to="/balance"
                    trailing-icon="i-lucide-move-right"
                >
                    Перейти к балансу
                </UButton>
            </div>
        </section>

        <section
            v-else-if="surveyState == 3"
            class="absolute -top-8 left-0 mt-[30px] h-screen w-screen flex-col items-center justify-center bg-[url(/surveys/background-mobile.svg)] bg-size-[105vw_100vh] pt-[50px] md:flex md:bg-[url(/surveys/background-desktop.svg)]"
        >
            <h2 class="mx-4 mt-10 text-2xl lg:mb-4 lg:text-2xl">
                ✅ Опросы на сегодня завершены!
            </h2>
            <div class="absolute bottom-[120px] left-0 mx-[20px] lg:static">
                <img
                    alt=""
                    class="w-full rounded-[10px]"
                    src="/surveys/ad.svg"
                />
                <UButton
                    class="mt-4 flex w-full justify-between bg-white text-black"
                    size="xxl"
                    to="/balance"
                    trailing-icon="i-lucide-move-right"
                >
                    Перейти к балансу
                </UButton>
            </div>
        </section>
    </div>

    <div v-if="surveyState == 3" class="finished-section-background"></div>
</template>

<script lang="ts" setup>
const userValue = ref<string>("");
const surveyState = ref<number>(1);
const currentQuestionIndex = ref<number>(0);
const questions = ref<string[]>([]);
const questionsLength = ref<number>(0);
const userAnswers = ref<string[]>([]);
const correctAnswersCount = ref<number>(0);
const correctAnswersUsdt = ref<number>(0);
const correctAnswersGovno = ref<number>(0);
const { user, fetchWithValidate, checkQuestionsExists, refreshBalance } =
    useUserStore();
const { focusScrollUnlock, focusScroll } = useAdaptiveStore();
const userId = user?.id;
const date = new Date();
const storageKey = `quiz_questions_${encodeURIComponent(userId ?? "")}_${date.getDate()}_${date.getFullYear()}_${date.getMonth()}`;
const isInputFocused = ref(false);

watchEffect(async () => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
        try {
            const parsed = JSON.parse(saved);

            if (parsed.answers.length == 10) {
                surveyState.value = 2;
            } else {
                questions.value = parsed.questions || [];

                currentQuestionIndex.value = parsed.currentIndex || 0;
                userAnswers.value = parsed.answers || [];
                questionsLength.value = questions.value.length;
            }
        } catch (e) {
            console.error("Ошибка при чтении данных из localStorage", e);
            await generateAndSaveQuestions();
        }
    } else {
        await generateAndSaveQuestions();
    }
});

async function generateAndSaveQuestions() {
    try {
        if (!(await checkQuestion())) return;
        const response = await fetchWithValidate("/quiz/get_questions", {
            method: "POST",
            body: {
                user_id: user?.id,
            },
        });
        console.log("asdasd");

        if (response.data && response.status == "success") {
            questions.value = response.data as string[];
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
    const response = await checkQuestionsExists();

    if (response.status == "success") {
        surveyState.value = 1;
        return true;
    } else {
        surveyState.value = 3;
        return false;
    }
}

async function sendAnswers() {
    try {
        const response = await fetchWithValidate("/quiz/validate-answers", {
            method: "POST",
            body: {
                user_id: user?.id,
                questions: questions.value,
                answers: userAnswers.value,
            },
        });

        type ResponseData = {
            correctAnswersCount: number;
            usdt: number;
            govno: number;
        };

        if (response.status === "success") {
            correctAnswersCount.value = (
                response.data as ResponseData
            ).correctAnswersCount;
            correctAnswersUsdt.value = (response.data as ResponseData).usdt;
            correctAnswersGovno.value = (response.data as ResponseData).govno;
            await refreshBalance();
            localStorage.removeItem(storageKey);
        }
    } catch (error) {
        console.error("Ошибка при отправке ответов", error);
    }
}
</script>
