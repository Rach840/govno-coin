<template>
   <div 
      class="flex flex-col items-center justify-start gap-7 
      pt-[var(--tg-safe-area-inset-top,env(safe-area-inset-top,0px))] 
      pr-[var(--tg-safe-area-inset-right,env(safe-area-inset-right,0px))] 
      pb-[var(--tg-safe-area-inset-bottom,env(safe-area-inset-bottom,0px))] 
      pl-[var(--tg-safe-area-inset-left,env(safe-area-inset-left,0px))] 
      mt-[0px] mb-[125px] overflow-auto max-h-fit" id="content_app"
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

const news = ref<any[]>(
   [
      {
         "title": "$GOVNO Challenge: реальные деньги за виртуальные потери",
         "content": "Стартап $GOVNO VR проводит ежемесячный конкурс для трейдеров в виртуальной реальности. Участники сталкиваются с симулированными сценариями крипто-кризисов. Побеждает тот, кто минимизирует потери, получая реальные $GOVNO в качестве приза.",
         "source": "CryptoSim Games Blog"
      },
      {
         "title": "$GOVNO запускает 'Блокчейн без прикрас'",
         "content": "Новый проект $GOVNO предлагает уникальную модель блокчейна, где транзакции являются публичными и верифицируемыми всеми участниками сети, обеспечивая абсолютную прозрачность и отсутствие скрытых сборов.",
         "source": "TransparentChain Community"
      },
      {
         "title": "Утечка кода в DAO $GOVNO раскрыла уязвимости",
         "content": "Критический баг обнаружен в коде $GOVNO DAO, благодаря утечке на GitHub. Уязвимость позволяла злоумышленникам манипулировать голосованиями. Разработчики устраняют проблему, общество требует компенсаций.",
         "source": "LeakTech News"
      },
      {
         "title": "TON на коленях: $GOVNO криптовалюта демонстрирует рост в 300%",
         "content": "Внезапный рост криптовалюты $GOVNO на 300% вызвал шок у инвесторов TON после того, как Павел Дуров случайно лайкнул твит о стремительном росте $GOVNO, что подняло волну интереса к монете.",
         "source": "CryptoCrunch App"
      },
      {
         "title": "$GOVNO теперь можно заправлять авто в Сингапуре",
         "content": "Запуск новой услуги в Сингапуре позволяет автовладельцам использовать криптовалюту $GOVNO для оплаты топлива на выбранных станциях. Это первый в мире эксперимент по использованию крипто на АЗС.",
         "source": "FuelCrypto Station Blog"
      },
      {
         "title": "Инвесторы бросили фиат за $GOVNO",
         "content": "Новый тренд среди инвесторов - обмен фиатных валют на криптовалюту $GOVNO. Увеличение оборота монеты на 150% последний месяц говорит о начале новой эры в инвестициях.",
         "source": "InvestFuture Web"
      },
      {
         "title": "$GOVNO Kits: DIY набор для крипто-фермеров",
         "content": "Компания $GOVNO запускает наборы для самостоятельной установки крипто-ферм на домашних ПК, позволяя каждому пользователю стать частью майнинговой сети без профессионального оборудования.",
         "source": "HomeMiner Forum"
      },
   
   ]
)

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