<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const step = ref(1);
const direction = ref<"forward" | "backward">("forward");
const isButtonClicked = ref(false);
const isFinishing = ref<boolean>(false);
const block = ref();
const { focusScroll } = useAdaptiveStore();
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
   gender: true, // true for male, false for female
});

const tg = window?.Telegram?.WebApp;

onMounted(() => {
   const initialHeight = window.innerHeight;
   const bg = document.getElementById("fixed-bg");
   if (bg) bg.style.height = `${initialHeight}px`;
});

function validateStep(stepNum: number): boolean {
   switch (stepNum) {
      case 1:
         return !!form.weight && !!form.height;
      case 2:
         return !!form.age;
      case 3:
         return !!form.amt;
      default:
         return false;
   }
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
   try {
      const response = await axios.post("/api/auth/user_reg", {
         user_id: tg?.initDataUnsafe?.user?.id,
         username: tg?.initDataUnsafe?.user?.first_name,
         user_age: form.age,
         user_height: form.height,
         user_weight: form.weight,
         user_sex: form.gender,
         user_toilet_visits: form.amt,
         referredCode: tg?.initDataUnsafe?.start_param || "None",
      });

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
   <div :ref="block" class="flex flex-col gap-3.5">
      <h1 class="text-(length:--h1)">Заполнение профиля</h1>

      <div class="flex gap-2.5">
         <UButton
            variant="link"
            class="w-full h-1"
            :class="
               step == 1 ? 'bg-(--main-blue)' : 'bg-(--disable-button-color)'
            "
            @click="goToStep(1)"
         ></UButton>
         <UButton
            variant="link"
            class="w-full h-1"
            :class="
               step == 2 ? 'bg-(--main-blue)' : 'bg-(--disable-button-color)'
            "
            @click="goToStep(2)"
         ></UButton>
         <UButton
            variant="link"
            class="w-full h-1"
            :class="
               step == 3 ? 'bg-(--main-blue)' : 'bg-(--disable-button-color)'
            "
            @click="goToStep(3)"
         ></UButton>
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
                     @focus="focusScroll"
                     class="w-full h-11.5 border-1 border-(--line-gray) rounded-[3vw]"
                     variant="none"
                     placeholder="Вес (кг)"
                     v-model="form.weight"
                     size="xl"
                  />
                  <UInput
                     @focus="focusScroll"
                     class="w-full h-11.5 border-1 border-(--line-gray) rounded-[3vw]"
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
                  @focus="focusScroll"
                  class="w-full h-11.5 border-1 border-(--line-gray) rounded-[3vw]"
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
                           ? 'bg-(--main-blue)'
                           : 'bg-(--disable-button-color)'
                     "
                     >Мужчина</UButton
                  >
                  <UButton
                     class="w-full h-11.5 flex justify-center"
                     @click="form.gender = false"
                     :class="
                        form.gender === false
                           ? 'bg-(--main-blue)'
                           : 'bg-(--disable-button-color)'
                     "
                     >Женщина</UButton
                  >
               </div>
            </div>

            <!-- Шаг 3 -->
            <div v-else-if="step === 3" class="flex flex-col gap-3.5">
               <h2 class="text-(length:--h3)">Ваш вклад в развитие</h2>
               <UInput
                  @focus="focusScroll"
                  class="w-full h-11.5 border-1 border-(--line-gray) rounded-[3vw]"
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
            class="w-[30%] h-11.5 rounded-[3vw] flex justify-center border-1 border-(--support-text-color)"
            @click="goBack"
            variant="link"
            :disabled="step === 1"
            >Назад</UButton
         >
         <UButton
            class="w-[100%] h-11.5 rounded-[3vw] px-5 text-black flex justify-between bg-(--main-blue)"
            @click="goNext"
            variant="link"
            :trailing-icon="
               step === 3 ? 'i-lucide-check' : 'i-lucide-arrow-right'
            "
         >
            {{ step < 3 ? "Продолжить" : "Завершить" }}
         </UButton>
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

/* Вперёд → справа */
.fade-slide-forward-enter-from {
   opacity: 0;
   transform: translateX(13vw);
}
.fade-slide-forward-leave-to {
   opacity: 0;
   transform: translateX(-13vw);
}

/* Назад → слева */
.fade-slide-backward-enter-from {
   opacity: 0;
   transform: translateX(-13vw);
}
.fade-slide-backward-leave-to {
   opacity: 0;
   transform: translateX(13vw);
}
</style>
