<template>
  <h1 class="text-h1">{{ validateText }}</h1>
</template>
<script setup lang="ts">
definePageMeta({
  
})
// const validateText = ref('Валидация...')
// const router = useRouter()
//       function isTelegramWebApp() {
//         try {
//           return window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData
//         } catch (e) {
//           return false
//         }
//       }
// const config = useRuntimeConfig();
//       if (isTelegramWebApp()) {
//         const tg = window.Telegram.WebApp
//         let user_id = window.Telegram.WebApp.initDataUnsafe.user.id;
//         tg.expand()
//         tg.requestFullscreen()
//         tg.disableVerticalSwipes();
//         const initData = tg.initData
//         const initDataUnsafe = tg.initDataUnsafe
// axios.post( `${config.public.apiUrl}/auth/validate_user`,{initData, initDataUnsafe }).then(async (response) => {
//   console.log(response.status)
//             if (response.status === 200) {
//               router.push('/register')
//             } else if (response.status === 201) {
//              router.push('/balance')
//             } else if (response.status === 203) {
//        validateText.value = '⛔ Вы заблокированы и не можете использовать приложение.'
//               if (tg && tg.close) {
//                 setTimeout(() => {
//                   tg.close()
//                 }, 3000)
//               }

//               throw new Error('User is banned')
//             } else {
//               throw new Error(`Server responded with status ${response.status}`)
//             }
//           })
//           .catch((err) => {
//             console.error('Error:', err)
//           validateText.value = `Ошибка валидация ❌ (${err.message})`
//           })
//       } else {
//       validateText.value ='Это приложение может открыто только в Telegram'
//       }
</script>
