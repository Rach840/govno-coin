<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";

import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const stepper = useTemplateRef("stepper");

const items = [
  {
    slot: "bodyParametr" as const,
  },
  {
    slot: "ageGender" as const,
  },
  {
    slot: "toiletMaining" as const,
  },
] satisfies StepperItem[];
const schema = z.object({
  weight: z.number().min(1, "Минимальный вес '10 кг'").max(300, "Максимальный вес '300 кг'"),
  height: z.number().min(1, "Минимальный рост '50 см'").max(250, "Максимальный рост '250 см'"),
  age: z.number().min(1, "Минимальный возраст '1 год'").max(110, "Максимальный возраст '110 лет'"),
  gender: z.boolean(),
  amt: z.number().min(1, "Минимальный вклад в развитие '1'").max(10, "Максимальный вклад в развитие '10'")
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  weight: undefined,
  height: undefined,
  age: undefined,
  gender: true,
  amt: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}


const step = ref<number>(1)

</script>

<template>
   <div class="flex flex-col gap-3.5">
      <h1 class="text-(length:--h1)">Заполнение профиля</h1>
      <div class="flex gap-2.5">
         <UButton variant="link" class="w-full h-1" :class="step == 1 ? 'bg-(--main-blue)' : 'bg-(--disable-button-color)'"></UButton>
         <UButton variant="link" class="w-full h-1" :class="step == 2 ? 'bg-(--main-blue)' : 'bg-(--disable-button-color)'"></UButton>
         <UButton variant="link" class="w-full h-1" :class="step == 3 ? 'bg-(--main-blue)' : 'bg-(--disable-button-color)'"></UButton>
      </div>

   
            <div class="flex flex-col gap-3.5">
               <h2 class="text-(length:--h3)">Параметры вашего тела</h2>
               <div class="flex gap-3">
               <UFormGroup label="Вес (кг)" name="weight">
                  <UInput class="w-full h-11.5 border-1 border-(--line-gray) rounded-[3vw]" variant="none" placeholder="Вес (кг)"  v-model="state.weight" size="xl" />
                  </UFormGroup>
                  <UInput class="w-full h-11.5 border-1 border-(--line-gray) rounded-[3vw]" variant="none" placeholder="Рост (см)"  v-model="state.height" size="xl" />
               </div>
            </div>
     
         
            <div class="flex flex-col gap-3.5">
               <h2 class="text-(length:--h3)">Параметры вашего тела</h2>
               <UInput class="w-full h-11.5 border-1 border-(--line-gray) rounded-[3vw]" variant="none" placeholder="Возраст (лет)" v-model="state.age" size="xl" />
               <div class="flex gap-2">
                  <UButton class="w-full h-11.5 flex justify-center" @click="state.gender = true" :class="state.gender == true ? 'bg-(--main-blue)' : 'bg-(--disable-button-color)'">Мужчина</UButton>
                  <UButton class="w-full h-11.5 flex justify-center" @click="state.gender = false" :class="state.gender == false ? 'bg-(--main-blue)' : 'bg-(--disable-button-color)'">Женщина</UButton>
               </div>
            </div>
    

     
            <div class="flex flex-col gap-3.5">
               <h2 class="text-(length:--h3)">Ваш вклад в развитие</h2>
               <UInput class="w-full h-11.5 border-1 border-(--line-gray) rounded-[3vw]" variant="none" placeholder="Сколько раз в день майнишь в туалете?" v-model="state.amt" size="xl" />
            </div>
      



      <div class="flex gap-3 justify-between mt-12">
         <UButton class="w-[30%] h-11.5 rounded-[3vw] flex justify-center border-1 border-(--support-text-color)" @click="stepper?.prev(), step--" variant="link">Назад</UButton>
         <UButton class="w-[100%] h-11.5 rounded-[3vw] px-5 text-black flex justify-between bg-(--main-blue)" trailing-icon="i-lucide-arrow-right" :disabled="!stepper?.hasNext" @click="stepper?.next(), step++" variant="link">Продолжить</UButton>
      </div>
   </div>
</template>
