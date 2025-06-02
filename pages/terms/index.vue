<template>
   <div class="flex flex-col gap-4">
      <!-- Заголовок и описание -->
      <div class="flex flex-col gap-2.5">
         <h1 class="text-(length:--h2)">
            📜 Пользовательское соглашение GOVNO COIN (18+)
         </h1>
         <p class="text-(length:--support-text)">
            Вступает в силу с момента первого взаимодействия с Приложением,
            включая его загрузку, открытие или использование любых функций.
         </p>
      </div>

      <!-- Условия -->
      <div
         v-for="(term, termIndex) in mockTerms"
         :key="termIndex"
         class="max-w-[90vw] box-border flex flex-col gap-2.5"
      >
         <h1 class="text-(length:--h4)">
            {{ term.title }}
         </h1>
         <p v-if="term.text" class="font-normal text-(length:--support-text)">
            {{ term.text }}
         </p>

         <div
            v-for="(content, contentIndex) in term.content"
            :key="contentIndex"
            class="font-normal text-(length:--support-text) text-(--support-text-color) flex flex-col items-center justify-center gap-5"
         >
            <h2 v-if="content.subtitle1">
               {{ content.subtitle1 }}
            </h2>

            <div
               v-if="content.ul"
               v-for="(ul, ulIndex) in content.ul"
               :key="ulIndex"
            >
               <p v-if="ul.ulTitle">
                  {{ ul.ulTitle }}
               </p>
               <ul>
                  <li
                     v-for="(li, liIndex) in ul.ulList"
                     :key="liIndex"
                     class="list-disc ml-6"
                  >
                     {{ li }}
                  </li>
               </ul>
            </div>

            <p v-if="content.subtitle2">
               {{ content.subtitle2 }}
            </p>
         </div>
      </div>

      <!-- Заключительное сообщение -->
      <p class="text-(length:--support-text)">
         DAO GOVNO COIN не обязано ничего никому. Добро пожаловать в Свободный
         Децентрализованный Беспредел.
      </p>

      <p class="text-(length:--support-text) text-(--support-text-color)">
         Приложение разработано децентрализованной группой разработчиков, не
         являющейся юридическим лицом. Все действия осуществляются на
         добровольной основе, вне рамок какой-либо юрисдикции.
      </p>

      <!-- Чекбокс согласия -->

      <div class="flex gap-3">
         <UCheckbox
            required
            label="  Я согласен с данными правилами"
            :ui="{
               label: 'font-normal text-(length:--support-text) text-(--support-text-color)',
            }"
            size="lg"
            v-model="agree"
            default-value
         />
      </div>

      <!-- Кнопка продолжения -->
      <UButton
         @click="replace()"
         :class="
            agree
               ? 'bg-(--main-blue)'
               : 'disabled:bg-(--disable-button-color) disabled:text-(--disable-text-color)'
         "
         class="h-[13.1vw] px-4.5 rounded-[3vw] text-(length:--button-text2) flex justify-between"
         trailing-icon="i-lucide-arrow-right"
         size="xl"
         :disabled="!agree"
      >
         Продолжить
      </UButton>
   </div>

   <div
      class="bg-[url(/terms/terms-background.svg)] bg-size-[100vw_100vh] w-[100vw] h-[100vh] fixed left-0 top-0 bg-center -z-1"
   ></div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { mockTerms } from "~/lib/mockData";
const router = useRouter();
const agree = ref<boolean>(false);
const link = ref<HTMLElement | null>(null);
definePageMeta({
   layout: "validate",
});
function replace() {
   if (agree.value) {
      router.push("/register");
   }
}
</script>
