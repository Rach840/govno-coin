<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'

import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const stepper = useTemplateRef('stepper')

const items = [
  {
    slot: 'bodyParametr' as const,
title:'Заполнение профиля',
  }, {
    slot: 'ageGender' as const,
  }, {
    slot: 'toiletMaining' as const,

  }
] satisfies StepperItem[];
const schema = z.object({
  weight: z.string().email('Invalid email'),
  height: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  weight: undefined,
  height: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4 flex" @submit="onSubmit">


  <UStepper ref="stepper" :ui="{
  trigger:'hidden'
}" :items="items"  class="w-full">
    <template #bodyParametr>
<div class="flex items-center space-x-4 justify-between">
  <UFormField name="weight">
    <UInput placeholder="Вес (кг)" v-model="state.weight"  size="xl"/>
  </UFormField>
  <UFormField name=" height">
    <UInput v-model="state.height" placeholder='Рост (см)' size="xl" type="height" />
  </UFormField>
</div>


    </template>

    <template #ageGender>
      <Placeholder class="aspect-video">
        Shipping
      </Placeholder>
    </template>

    <template #toiletMaining>
      <Placeholder class="aspect-video">
        Checkout
      </Placeholder>
    </template>
  </UStepper>
  </UForm>
  <div class="flex gap-2 justify-between mt-4">

    <UButton class="w-4/12 flex justify-between"      :disabled="!stepper?.hasPrev"
             @click="stepper?.prev()"  size="xxl" trailing-icon="i-lucide-move-right"   color="primary" variant="outline">Назад</UButton>


    <UButton
        color="info"
        variant="solid"
        class="size-8/12 lg:size-9/12"
        size="xxl"
        trailing-icon="i-lucide-arrow-right"
        :disabled="!stepper?.hasNext"
        @click="stepper?.next()"
    >
      Продолжить
    </UButton>
  </div>

</template>

