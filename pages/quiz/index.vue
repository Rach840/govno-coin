<template>
    <div class="survey-container" id="content_app">
      <section v-if="surveyState == 1">
        <div class=" mb-5 flex justify-between items-center">
        <h1 class="text-h1 lg:text-3xl font-semibold ">Опрос</h1>
        <p class="text-xl text-(--support-text-color)">{{ currentQuestionIndex  + 1}} / 10</p>
        </div>
        <h3 class="text-h2 mb-5
        ">
          {{ questions.length > 0 ? questions[currentQuestionIndex] : "Загрузка вопросов..." }}
        </h3>
         <UInput

              size="xl"
              :ui="{
                 base:'p-4 bg-transparent',

              }"
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
          :ui="{
            
          }"
        trailing-icon="i-lucide-arrow-right"
        >
          Продолжить

        </UButton>
      </section>

      <section v-else-if="surveyState == 2" class="results-section">
        <h1 class="survey-container-title">Опрос</h1>
        <div class="results-content">
          <h3 class="results-subtitle">✅ Опрос завершён!</h3>
          <p class="results-profit">+{{ correctAnswersCount * 0.001 }} $GOVNO <span>~ ... $USDT</span></p>
          <p class="results-info">
            Сегодня вы ответили правильно на {{ correctAnswersCount }} из {{ questionsLength }} вопросов, приходите завтра!
          </p>
          <p class="results-subinfo">
            Опросы обновляются ежедневно, за их прохождение вы сможете заработать $GOVNO
          </p>
        </div>
          <div class="results-subwrap">
          <img class="surveys-ad" src="/surveys/ad.svg" alt="">
          <NuxtLink to="/balance" class="survey-container-button results-next">Продолжить
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="12" viewBox="0 0 25 12" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M18.8726 0L25 6L18.8725 12L17.402 10.56L21.019 7.01823H0L0 4.98176H21.019L17.402 1.44L18.8726 0Z" fill="currentColor" />
            </svg>
          </NuxtLink>
          </div>
      </section>

      <section v-else-if="surveyState == 3" class="finished-section">
        <h2 class="finished-title">✅ Опросы на сегодня завершены!</h2>
        <div class="finished-section-subwrap">
          <img class="surveys-ad" src="/public/surveys/ad.svg" alt="">
          <nuxt-link class="survey-container-button finished-link" to="/balance">Перейти к заданиям <imgArrow></imgArrow></nuxt-link>
        </div>
      </section>
    </div>
    <Menu class="menu"></Menu>
    <div v-if="surveyState == 3" class="finished-section-background"></div>
</template>

<script setup lang="ts">
import axios from 'axios'

const userValue = ref<string>('')
const surveyState = ref<number>(1)
const showFinishedMessage = ref<boolean>(false)
const currentQuestionIndex = ref<number>(0)
const questions = ref<string[]>([])
const questionsLength = ref<number>(0)
const userAnswers = ref<string[]>([])
const correctAnswersCount = ref<number>(0)
const  {user} = useUserStore();
 const config = useRuntimeConfig();

const userId = user?.id;
const storageKey = `quiz_questions_${encodeURIComponent(userId)}`

onMounted(async () => {
  const saved = localStorage.getItem(storageKey)
console.log('fsdf',saved);

  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      questions.value = parsed.questions || []
      currentQuestionIndex.value = parsed.currentIndex || 0
      userAnswers.value = parsed.answers || []
      questionsLength.value = questions.value.length

      if (currentQuestionIndex.value >= questions.value.length) {
        surveyState.value = 2
      }
    } catch (e) {
      console.error('Ошибка при чтении данных из localStorage', e)
      await generateAndSaveQuestions()
    }
  } else {
    generateAndSaveQuestions()
  }
})

async function generateAndSaveQuestions() {
  try {
    const response = await axios.post(`${config.public.apiUrl}/quiz/get_questions`, { userId })

    if (response.status === 200 && response.data.questions) {
      questions.value = response.data.questions
      questionsLength.value = questions.value.length
      currentQuestionIndex.value = 0
      userAnswers.value = []

      saveProgress()
    }
  } catch (error) {
    surveyState.value = 3
    console.error('Ошибка при получении вопросов', error)
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
  )
}

async function nextQuestion() {
  if (userValue.value.trim() === '') {
    return
  }

  userAnswers.value.push(userValue.value.trim())
  userValue.value = ''

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    saveProgress()
  } else {
    surveyState.value = 2
    await sendAnswers()
    localStorage.removeItem(storageKey)
  }
}
async function checkQuestion() {
    const {status} = await useFetch(`${config.public.apiUrl}/quiz/check_question`,{
        method: 'post',
        body:{
            user_id: userId
        }
    })
    if (status.data == 'success') {
        surveyState.
    }
}
async function sendAnswers() {
  try {
    const response = await axios.post(`${config.public.apiUrl}/quiz/validate-answers`, {
      userId,
      questions: questions.value,
      answers: userAnswers.value,
    })

    if (response.status === 200) {
      correctAnswersCount.value = response.data.correctAnswersCount
      localStorage.removeItem(storageKey)
    }
  } catch (error) {
    console.error('Ошибка при отправке ответов', error)
  }
}
</script>
