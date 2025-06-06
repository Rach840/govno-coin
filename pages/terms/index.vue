<script lang="ts" setup>
import { useRouter } from "vue-router";
import { mockTerms } from "~/lib/mockData";

const router = useRouter();
const agree = ref<boolean>(false);

definePageMeta({
    layout: "validate",
});

function replace() {
    if (agree.value) {
        router.push("/register");
    }
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2.5">
            <h1 class="text-center text-(length:--h2)">
                📜 Пользовательское соглашение GOVNO COIN (18+)
            </h1>
            <p class="text-center">
                Вступает в силу с момента первого взаимодействия с Приложением,
                включая его загрузку, открытие или использование любых функций.
            </p>
        </div>
        <div
            v-for="(term, termIndex) in mockTerms"
            :key="termIndex"
            class="mx-auto box-border flex max-w-5/6 flex-col gap-2.5"
        >
            <h1 class="text-center text-(length:--h4)">
                {{ term.title }}
            </h1>
            <p v-if="term.text" class="text-center font-normal">
                {{ term.text }}
            </p>
            <div
                v-for="(content, contentIndex) in term.content"
                :key="contentIndex"
                class="text-support flex flex-col items-center justify-center gap-5 text-center font-normal"
            >
                <h2 class="text-center" v-if="content.subtitle1">
                    {{ content.subtitle1 }}
                </h2>
                <p class="text-center" v-if="content.subtitle2">
                    {{ content.subtitle2 }}
                </p>
            </div>
        </div>
        <p class="text-center">
            DAO GOVNO COIN не обязано ничего никому. Добро пожаловать в
            Свободный Децентрализованный Беспредел.
        </p>
        <p class="text-support text-center">
            Приложение разработано децентрализованной группой разработчиков, не
            являющейся юридическим лицом. Все действия осуществляются на
            добровольной основе, вне рамок какой-либо юрисдикции.
        </p>
        <div class="flex gap-3">
            <UCheckbox
                v-model="agree"
                :ui="{
                    label: 'font-normal  text-support',
                }"
                default-value
                label="  Я согласен с данными правилами"
                required
                size="lg"
            />
        </div>
        <UButton
            :class="
                agree
                    ? 'bg-main-blue'
                    : 'disabled:bg-disabled disabled:text-(--disable-text-color)'
            "
            :disabled="!agree"
            class="flex h-12 justify-between rounded-lg px-4.5 text-(length:--button-text2)"
            size="xl"
            trailing-icon="i-lucide-arrow-right"
            @click="replace()"
        >
            Продолжить
        </UButton>
    </div>
    <div
        class="fixed top-0 left-0 -z-1 h-[100vh] w-[100vw] bg-[url(/terms/terms-background.svg)] bg-size-[100vw_100vh] bg-center"
    />
</template>
