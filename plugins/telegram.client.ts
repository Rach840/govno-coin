export default defineNuxtPlugin(() => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    tg.ready()
    tg.expand() 
    console.log('Telegram WebApp инициализирован')
  } else {
    console.warn('Telegram WebApp недоступен (не в Telegram?)')
  }
})