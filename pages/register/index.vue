<script lang="ts" setup>
definePageMeta({
    layout: "register",
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

const errors = reactive({
    weight: false,
    height: false,
    age: false,
    amt: false,
});

const tg = window?.Telegram?.WebApp;

function validateStep(stepNum: number): boolean {
    let valid = true;

    if (stepNum === 1) {
        errors.weight =
            !form.weight ||
            Number(form.weight) < 1 ||
            Number(form.weight) > 300;
        errors.height =
            !form.height ||
            Number(form.height) < 1 ||
            Number(form.height) > 250;
        valid = !errors.weight && !errors.height;
    }

    if (stepNum === 2) {
        errors.age =
            !form.age || Number(form.age) < 1 || Number(form.age) > 110;
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
        const response = await fetch(`${config.public.apiUrl}/auth/user_reg`, {
            body: JSON.stringify({
                user_id: tg?.initDataUnsafe?.user?.id,
                username: tg?.initDataUnsafe?.user?.first_name,
                user_age: form.age,
                user_height: form.height,
                user_weight: form.weight,
                user_sex: form.gender,
                user_toilet_visits: form.amt,
                referredCode: tg?.initDataUnsafe?.start_param || "None",
            }),
        });

        if (response.status === 200) {
            await router.push("/balance");
        }
    } catch (err) {
        console.error("Ошибка при отправке формы:", err);
    }
}

const isInputFocused = ref(false);
</script>

<template>
    <div
        class="pointer-events-none absolute inset-0 z-0 h-screen duration-[999999999s]"
    >
        <img
            alt="background"
            class="h-full w-full object-cover"
            src="/register/register-background-mobile.svg"
        />
    </div>
    <div :ref="block" class="overflow-x-hidden">
        <div class="relative z-20 flex flex-col gap-3.5 px-3.5 text-center">
            <h1 class="text-(length:--h1)">Заполнение профиля</h1>

            <div class="flex gap-2.5">
                <UButton
                    :class="
                        step == 1
                            ? 'bg-(--main-blue)'
                            : 'bg-(--disable-button-color)'
                    "
                    class="h-1 w-full p-0"
                    variant="link"
                    @click="goToStep(1)"
                >
                </UButton>
                <UButton
                    :class="
                        step == 2
                            ? 'bg-(--main-blue)'
                            : 'bg-(--disable-button-color)'
                    "
                    class="h-1 w-full p-0"
                    variant="link"
                    @click="goToStep(2)"
                >
                </UButton>
                <UButton
                    :class="
                        step == 3
                            ? 'bg-(--main-blue)'
                            : 'bg-(--disable-button-color)'
                    "
                    class="h-1 w-full p-0"
                    variant="link"
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
                    <div v-if="step === 1" class="flex flex-col gap-3.5">
                        <h2 class="text-(length:--h3)">
                            Параметры вашего тела
                        </h2>
                        <div class="flex gap-3">
                            <UInput
                                v-model="form.weight"
                                :class="[
                                    'h-11.5 w-full rounded-[3vw] border-1',
                                    errors.weight
                                        ? 'border-red-500'
                                        : 'border-(--line-gray)',
                                ]"
                                max="300"
                                min="1"
                                placeholder="Вес (кг)"
                                size="xl"
                                type="number"
                                variant="none"
                                @focus="
                                    isInputFocused = true;
                                    focusScroll();
                                "
                                @focusout="
                                    isInputFocused = false;
                                    focusScrollUnlock();
                                "
                            />
                            <UInput
                                v-model="form.height"
                                :class="[
                                    'h-11.5 w-full rounded-[3vw] border-1 !text-(--support-text-color)',
                                    errors.height
                                        ? 'border-red-500'
                                        : 'border-(--line-gray)',
                                ]"
                                max="250"
                                min="1"
                                placeholder="Рост (см)"
                                size="xl"
                                type="number"
                                variant="none"
                                @focus="
                                    isInputFocused = true;
                                    focusScroll();
                                "
                                @focusout="
                                    isInputFocused = false;
                                    focusScrollUnlock();
                                "
                            />
                        </div>
                    </div>
                    <div v-else-if="step === 2" class="flex flex-col gap-3.5">
                        <h2 class="text-(length:--h3)">
                            Параметры вашего тела
                        </h2>
                        <UInput
                            v-model="form.age"
                            :class="[
                                'h-11.5 w-full rounded-[3vw] border-1 !text-(--support-text-color)',
                                errors.age
                                    ? 'border-red-500'
                                    : 'border-(--line-gray)',
                            ]"
                            max="110"
                            min="1"
                            placeholder="Возраст (лет)"
                            size="xl"
                            type="number"
                            variant="none"
                            @focus="
                                isInputFocused = true;
                                focusScroll();
                            "
                            @focusout="
                                isInputFocused = false;
                                focusScrollUnlock();
                            "
                        />
                        <div class="flex gap-2">
                            <UButton
                                :class="
                                    form.gender === true
                                        ? 'bg-(--main-blue) text-white'
                                        : 'bg-(--disable-button-color) !text-(--support-text-color)'
                                "
                                class="flex h-11.5 w-full justify-center"
                                @click="form.gender = true"
                            >
                                Мужчина
                            </UButton>
                            <UButton
                                :class="
                                    form.gender === false
                                        ? 'bg-(--main-blue) text-white'
                                        : 'bg-(--disable-button-color) !text-(--support-text-color)'
                                "
                                class="flex h-11.5 w-full justify-center"
                                @click="form.gender = false"
                            >
                                Женщина
                            </UButton>
                        </div>
                    </div>
                    <div v-else-if="step === 3" class="flex flex-col gap-3.5">
                        <h2 class="text-(length:--h3)">Ваш вклад в развитие</h2>
                        <UInput
                            v-model="form.amt"
                            :class="[
                                'h-11.5 w-full rounded-[3vw] border-1 !text-(--support-text-color)',
                                errors.amt
                                    ? 'border-red-500'
                                    : 'border-(--line-gray)',
                            ]"
                            max="10"
                            min="1"
                            placeholder="Сколько раз в день майнишь в туалете?"
                            size="xl"
                            type="number"
                            variant="none"
                            @focus="
                                isInputFocused = true;
                                focusScroll();
                            "
                            @focusout="
                                isInputFocused = false;
                                focusScrollUnlock();
                            "
                        />
                    </div>
                </div>
            </transition>

            <div class="mt-12 flex justify-between gap-3">
                <UButton
                    :disabled="step === 1"
                    class="flex h-11.5 w-[35%] justify-center rounded-[3vw] border-1 border-(--line-gray)"
                    variant="link"
                    @click="goBack"
                    >Назад
                </UButton>
                <UButton
                    :trailing-icon="
                        step === 3 ? 'i-lucide-check' : 'i-lucide-move-right'
                    "
                    class="flex h-11.5 w-[100%] justify-center rounded-[3vw] bg-(--main-blue) px-5 text-center text-black"
                    variant="link"
                    @click="goNext"
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
