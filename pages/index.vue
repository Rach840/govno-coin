<template>
   <div class="py-13">
      <h1 class="text-h1 text-center text-white">{{ validateText }}</h1>
   </div>
</template>
<script setup lang="ts">
import axios from "axios";

const validateText = ref("Валидация...");
const router = useRouter();
function isTelegramWebApp() {
   try {
      return (
         window.Telegram &&
         window.Telegram.WebApp &&
         window.Telegram.WebApp.initData
      );
   } catch (e) {
      return false;
   }
}
definePageMeta({
   layout: "validate",
});
const { refreshBalance } = useUserStore()
const config = useRuntimeConfig();
if (isTelegramWebApp()) {
   const tg = window.Telegram.WebApp;
   tg.expand();
   tg.requestFullscreen();
   tg.disableVerticalSwipes();
   tg.lockOrientation();
   const initData = tg.initData;
   const initDataUnsafe = tg.initDataUnsafe;
   axios
      .post(`${config.public.apiUrl}/auth/validate_user`, {
         initData,
         initDataUnsafe,
      })
      .then(async (response) => {
         console.log(response.status);
         if (response.status === 200) {
            router.push("/terms");
         } else if (response.status === 201) {
            await refreshBalance()
            router.push("/balance");
         } else if (response.status === 404 || response.status === 423 || response.status === 400) {
            validateText.value =
               "⛔ Вход в приложение доступен только для пользователей минимум с 50 $GOVNO на балансе кошелька.";
         }else if (response.status === 203) {
            validateText.value =
               "⛔ Вы заблокированы и не можете использовать приложение.";
            if (tg && tg.close) {
               setTimeout(() => {
                  tg.close();
               }, 3000);
            }

            throw new Error("User is banned");
         } else {
            throw new Error(`Server responded with status ${response.status}`);
         }

         // window.Telegram?.WebApp?.showPopup({
         //    title: "💩 Govno Coin на первой месте!!!",
         //    message: "Мы доказали и доказываем что мы лучшие!",
         //    buttons: [{ text: "Ура ассенизаторам!", type: "ok" }],
         // });
      })
      .catch((err) => {
         console.error("Error:", err);
         validateText.value = `Ошибка валидация ❌ (${err.message})`;
      });
} else {
   validateText.value = "Это приложение может открыто только в Telegram";
}
</script>
