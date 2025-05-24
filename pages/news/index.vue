<template>
   <div 
      class="flex flex-col items-center justify-start gap-7"
   >
      <!-- Заголовок страницы -->
      <p class="w-full text-h2 font-semibold text-start">Новости</p>
      
      <!-- Контейнер для всех новостей -->
      <div class="flex flex-col justify-center items-center gap-[14px] w-full">
         <!-- Карточка новости -->
         <div
         v-for="(item, index) in news"
         :key="index"
         class="w-full rounded-[20px] p-[15px] flex flex-col justify-between box-border gap-[15px]"
         style="background: linear-gradient(162deg, var(--color-light-gray) 0%, var(--color-dark-gray) 100%);"
         >
         <!-- Заголовок новости -->
         <p class="text-edit-text1 font-medium">{{ item.title }}</p>
         
         <!-- Содержание новости -->
         <p class="text-[15px] font-normal">{{ item.content }}</p>
         
         <!-- Источник новости -->
         <p 
            v-if="item.source !== 't.me/cryptover1'" 
            class="text-[14px] font-normal text-[var(--support-text-color)]"
         >
            {{ item.source }}
         </p>
         
         <!-- Источник-ссылка для криптовера -->
         <a 
            href="https://t.me/cryptover1" 
            v-if="item.source == 't.me/cryptover1'" 
            class="text-[14px] font-normal underline text-[#008EFA]"
         >
            t.me/cryptover1
         </a>
         </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const news = ref<any[]>([])

const CACHE_KEY = 'news'
const DATE_KEY = 'news_update_date'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

async function fetchNews(forceUpdate = false) {
  const raw = localStorage.getItem(CACHE_KEY)
  const savedDate = localStorage.getItem(DATE_KEY)
  const today = getToday()

  let cached = null
  try {
    cached = raw ? JSON.parse(raw) : null
  } catch (e) {
    console.warn('⚠️ Повреждённый JSON в localStorage')
    localStorage.removeItem(CACHE_KEY)
  }

  if (!forceUpdate && cached && savedDate === today) {
    news.value = cached
    console.log('📦 Новости из localStorage')
    return
  }

  try {
    const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id ?? ''
    const { data } = await axios.get(`/api/news/get_news?user_id=${tgUserId}`)
    news.value = data.news
    localStorage.setItem(CACHE_KEY, JSON.stringify(data.news))
    localStorage.setItem(DATE_KEY, data.date || today)
    console.log('🆕 Новости с сервера')
  } catch (e) {
    console.error('❌ Ошибка при загрузке новостей:', e)
  }
}

onMounted(() => {
  fetchNews()
})
</script>