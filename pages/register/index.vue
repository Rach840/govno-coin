<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
definePageMeta({
   layout: "register",
   pageTransition: { name: "trans", mode: "default" },
});
const router = useRouter();
const step = ref(1);
const direction = ref<"forward" | "backward">("forward");
const isButtonClicked = ref(false);
const isFinishing = ref(false);
const block = ref();
const { focusScroll, focusScrollUnlock } = useAdaptiveStore();

onMounted(() => {
   document.body.style.overflow = "hidden";
   document.documentElement.style.overflow = "hidden";
});

onBeforeUnmount(() => {
   document.body.style.overflow = "";
   document.documentElement.style.overflow = "";
});

const form = reactive({
   weight: "",
   height: "",
   age: "",
   amt: "",
   gender: true,
});

// ошибки по шагам
const errors = reactive({
   weight: false,
   height: false,
   age: false,
   amt: false,
});

const tg = window?.Telegram?.WebApp;

onMounted(() => {
   const initialHeight = window.innerHeight;
   const bg = document.getElementById("fixed-bg");
   if (bg) bg.style.height = `${initialHeight}px`;
});

function validateStep(stepNum: number): boolean {
   let valid = true;

   if (stepNum === 1) {
      errors.weight =
         !form.weight || Number(form.weight) < 1 || Number(form.weight) > 300;
      errors.height =
         !form.height || Number(form.height) < 1 || Number(form.height) > 250;
      valid = !errors.weight && !errors.height;
   }

   if (stepNum === 2) {
      errors.age = !form.age || Number(form.age) < 1 || Number(form.age) > 110;
      valid = !errors.age;
   }

   if (stepNum === 3) {
      errors.amt = !form.amt || Number(form.amt) < 1 || Number(form.amt) > 10;
      valid = !errors.amt;
   }

   return valid;
}

function goNext() {
   isButtonClicked.value = true;

   if (!validateStep(step.value)) {
      return;
   }

   direction.value = "forward";

   if (step.value < 3) {
      step.value++;
      isButtonClicked.value = false;
   } else {
      isFinishing.value = true;
      step.value++;
      submitForm();
   }
}

function goBack() {
   if (step.value > 1) {
      direction.value = "backward";
      step.value--;
      isButtonClicked.value = false;
   }
}

function goToStep(target: number) {
   if (target < step.value) {
      direction.value = "backward";
   } else if (target > step.value) {
      direction.value = "forward";
   }
   step.value = target;
}

async function submitForm() {
   const config = useRuntimeConfig();
   try {
      const response = await axios.post(
         `${config.public.apiUrl}/auth/user_reg`,
         {
            user_id: tg?.initDataUnsafe?.user?.id,
            username: tg?.initDataUnsafe?.user?.first_name,
            user_age: form.age,
            user_height: form.height,
            user_weight: form.weight,
            user_sex: form.gender,
            user_toilet_visits: form.amt,
            referredCode: tg?.initDataUnsafe?.start_param || "None",
         },
      );

      if (response.status === 200) {
         setTimeout(() => {
            router.push("/balance");
         }, 100);
      }
   } catch (err) {
      console.error("не отправилось");
   }
}
</script>

<template>
   <div class=""></div>

   <div :ref="block" class="padding-container relative overflow-x-hidden">
      <div
         class="z-20 relative px-3.5 my-[100px] flex flex-col gap-3.5 text-center"
      >
         <h1 class="text-(length:--h1)">Заполнение профиля</h1>

         <div class="flex gap-2.5">
            <UButton
               variant="link"
               class="w-full h-1 p-0"
               :class="
                  step == 1 ? 'bg-(--main-blue)' : 'bg-(--disable-button-color)'
               "
               @click="goToStep(1)"
            >
            </UButton>
            <UButton
               variant="link"
               class="w-full h-1 p-0"
               :class="
                  step == 2 ? 'bg-(--main-blue)' : 'bg-(--disable-button-color)'
               "
               @click="goToStep(2)"
            >
            </UButton>
            <UButton
               variant="link"
               class="w-full h-1 p-0"
               :class="
                  step == 3 ? 'bg-(--main-blue)' : 'bg-(--disable-button-color)'
               "
               @click="goToStep(3)"
            >
            </UButton>
         </div>

         <transition
            :name="
               direction === 'forward'
                  ? 'fade-slide-forward'
                  : 'fade-slide-backward'
            "
            mode="out-in"
         >
            <div :key="step">
               <!-- Шаг 1 -->
               <div v-if="step === 1" class="flex flex-col gap-3.5">
                  <h2 class="text-(length:--h3)">Параметры вашего тела</h2>
                  <div class="flex gap-3">
                     <UInput
                        type="number"
                        min="1"
                        max="300"
                        @focus="(e) => focusScroll(e)"
                        @focusout="(e) => focusScrollUnlock(e)"
                        :class="[
                           'w-full h-11.5 border-1 rounded-[3vw]   ',
                           errors.weight
                              ? 'border-red-500'
                              : 'border-(--line-gray)',
                        ]"
                        variant="none"
                        placeholder="Вес (кг)"
                        v-model="form.weight"
                        size="xl"
                     />
                     <UInput
                        type="number"
                        min="1"
                        max="250"
                        @focus="(e) => focusScroll(e)"
                        @focusout="(e) => focusScrollUnlock(e)"
                        :class="[
                           'w-full h-11.5 border-1 rounded-[3vw] !text-(--support-text-color)',
                           errors.height
                              ? 'border-red-500'
                              : 'border-(--line-gray)',
                        ]"
                        variant="none"
                        placeholder="Рост (см)"
                        v-model="form.height"
                        size="xl"
                     />
                  </div>
               </div>

               <!-- Шаг 2 -->
               <div v-else-if="step === 2" class="flex flex-col gap-3.5">
                  <h2 class="text-(length:--h3)">Параметры вашего тела</h2>
                  <UInput
                     type="number"
                     min="1"
                     max="110"
                     @focus="(e) => focusScroll(e)"
                     @focusout="(e) => focusScrollUnlock(e)"
                     :class="[
                        'w-full h-11.5 border-1 rounded-[3vw] !text-(--support-text-color)',
                        errors.age ? 'border-red-500' : 'border-(--line-gray)',
                     ]"
                     variant="none"
                     placeholder="Возраст (лет)"
                     v-model="form.age"
                     size="xl"
                  />
                  <div class="flex gap-2">
                     <UButton
                        class="w-full h-11.5 flex justify-center"
                        @click="form.gender = true"
                        :class="
                           form.gender === true
                              ? 'bg-(--main-blue) text-white'
                              : 'bg-(--disable-button-color) !text-(--support-text-color)'
                        "
                     >
                        Мужчина</UButton
                     >
                     <UButton
                        class="w-full h-11.5 flex justify-center"
                        @click="form.gender = false"
                        :class="
                           form.gender === false
                              ? 'bg-(--main-blue) text-white'
                              : 'bg-(--disable-button-color) !text-(--support-text-color)'
                        "
                     >
                        Женщина</UButton
                     >
                  </div>
               </div>

               <!-- Шаг 3 -->
               <div v-else-if="step === 3" class="flex flex-col gap-3.5">
                  <h2 class="text-(length:--h3)">Ваш вклад в развитие</h2>
                  <UInput
                     type="number"
                     min="1"
                     max="10"
                     @focus="(e) => focusScroll(e)"
                     @focusout="(e) => focusScrollUnlock(e)"
                     :class="[
                        'w-full h-11.5 border-1 rounded-[3vw] !text-(--support-text-color)',
                        errors.amt ? 'border-red-500' : 'border-(--line-gray)',
                     ]"
                     variant="none"
                     placeholder="Сколько раз в день майнишь в туалете?"
                     v-model="form.amt"
                     size="xl"
                  />
               </div>
            </div>
         </transition>

         <div class="flex gap-3 justify-between mt-12">
            <UButton
               class="w-[35%] h-11.5 rounded-[3vw] flex justify-center border-1 border-(--line-gray)"
               @click="goBack"
               variant="link"
               :disabled="step === 1"
               >Назад</UButton
            >
            <UButton
               class="w-[100%] text-center h-11.5 rounded-[3vw] px-5 text-black flex justify-center bg-(--main-blue)"
               @click="goNext"
               variant="link"
               :trailing-icon="
                  step === 3 ? 'i-lucide-check' : 'i-lucide-move-right'
               "
            >
               {{ step < 3 ? "Продолжить" : "Завершить" }}
            </UButton>
         </div>
      </div>
   </div>
</template>

<style>
.fade-slide-forward-enter-active,
.fade-slide-forward-leave-active,
.fade-slide-backward-enter-active,
.fade-slide-backward-leave-active {
   transition: all 0.6s ease-in-out;
}

.fade-slide-forward-enter-from {
   opacity: 0;
   transform: translateX(13vw);
}
.fade-slide-forward-leave-to {
   opacity: 0;
   transform: translateX(-13vw);
}

.fade-slide-backward-enter-from {
   opacity: 0;
   transform: translateX(-13vw);
}
.fade-slide-backward-leave-to {
   opacity: 0;
   transform: translateX(13vw);
}
</style>
