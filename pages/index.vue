<script lang="ts" setup>
const validateText = ref("Валидация...");
const router = useRouter();

definePageMeta({
    layout: "validate",
});

const { refreshBalance } = useUserStore();

if (
    !!window.Telegram &&
    !!window.Telegram?.WebApp &&
    !!window.Telegram?.WebApp?.initData
) {
    const config = useRuntimeConfig();
    const tg = window.Telegram.WebApp;

    tg.expand();
    tg.requestFullscreen();
    tg.disableVerticalSwipes();
    tg.lockOrientation();

    const initData = tg.initData;
    const initDataUnsafe = tg.initDataUnsafe;
    fetch(`${config.public.apiUrl}/auth/validate_user`, {
        method: "POST",
        body: JSON.stringify({
            initData,
            initDataUnsafe,
        }),
    })
        .then(async (response) => {
            if (response.status === 200) {
                await router.push("/terms");
            } else if (response.status === 201) {
                await refreshBalance();
                await router.push("/balance");
            } else if (
                response.status === 404 ||
                response.status === 423 ||
                response.status === 400
            ) {
                validateText.value =
                    "⛔ Вход в приложение доступен только для пользователей минимум с 50 $GOVNO на балансе кошелька.";
            } else if (response.status === 203) {
                validateText.value =
                    "⛔ Вы заблокированы и не можете использовать приложение.";
                if (tg && tg.close) {
                    setTimeout(() => {
                        tg.close();
                    }, 3000);
                }

                throw new Error("User is banned");
            } else {
                throw new Error(
                    `Server responded with status ${response.status}`,
                );
            }
        })
        .catch((err) => {
            console.error("Error:", err);
            validateText.value = `Ошибка валидация ❌ (${err.message})`;
        });
} else {
    validateText.value = "Это приложение может открыто только в Telegram";
}
</script>

<template>
    <div class="py-13">
        <h1 class="text-center text-3xl text-white">{{ validateText }}</h1>
    </div>
</template>
