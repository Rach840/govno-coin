<template>
   <div class="flex flex-col gap-5">
      <p class="text-(length:--h1) font-semibold text-center">$GOVNO кошелёк</p>
      <div class="bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)] rounded-[4vw] p-3.5 flex flex-col gap-5">
         <div class="flex flex-col gap-0">
            <p class="text-(length:--support-text) text-(--support-text-color)">Общий баланс</p>
            <p class="text-(length:--h0) font-semibold">$ {{ valueUsdt >= 0 ? valueUsdt.toFixed(2) : '0.00' }}</p>
            <span class="text-(length:--support-text) text-(--support-text-color)">~ {{ valueGovno >= 0 ? valueGovno.toFixed(2) : '0.00' }} $GOVNO</span>
         </div>

         <div class="flex flex-col gap-0">
            <p class="text-(length:--support-text) text-(--support-text-color)">❄️ В заморозке</p>
            <p class="text-(length:--h0) font-semibold">$ 0.00</p>
            <span class="text-(length:--support-text) text-(--support-text-color)">~ 0.00 $GOVNO</span>
         </div>

         <div class="w-full flex flex-col gap-2.5">
            <div class="text-(length:--h3) flex gap-3.5">
               <button class="balance-interaction-select-point text-(--support-text-color)" @click="actionSelect = 'replenishment'" :class="{ 'underline underline-offset-1 decoration-(--main-blue) text-white': actionSelect === 'replenishment' }">Пополнение</button>
               <button class="balance-interaction-select-point text-(--support-text-color)" @click="actionSelect = 'withdrawal'" :class="{ 'underline underline-offset-1 decoration-(--main-blue) text-white': actionSelect === 'withdrawal' }">Вывод</button>
            </div>
            <div class="flex flex-col gap-3.5">
               <UInput variant="none" class="border-1 border-(--line-gray) h-[13.1vw] rounded-[3.5vw] text-(length:--support-text)"></UInput>
               <Ubutton class="h-[13.1vw] bg-(--main-blue) flex justify-center items-center text-black rounded-[3.5vw] text-(length:--support-text)">Криптой</Ubutton>
               <NuxtLink to="/about" class="h-[13.1vw] bg-white flex justify-center items-center text-black rounded-[3.5vw] text-(length:--support-text)">Банковской картой</NuxtLink>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const valueUsdt = ref<number>(-1)
const valueGovno = ref<number>(-1)
const userValue = ref('')
const sum = ref<number>(0)
const actionSelect = ref<'replenishment' | 'withdrawal'>('replenishment')

onMounted(async () => {
  await getBalance()
})

function submitBalance() {
  if (userValue.value.trim() == '' || Number(userValue.value) <= 0) return

  sum.value = Number(userValue.value)
  if (actionSelect.value === 'replenishment') {
    replenishmentPost()
    userValue.value = ''
  } else if (actionSelect.value === 'withdrawal') {
    withdrawPost()
    userValue.value = ''
  }
}

async function getBalance() {
  try {
    const response = await axios.post('/api/balance/get_balance', {
      user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
    })

    if (response.status === 200) {
      valueUsdt.value = parseFloat(response.data.balance) || 0
      valueGovno.value = parseFloat(response.data.balance) || 0
    }
  } catch (error) {
    console.error('Ошибка при получении баланса ❌', error)
  }
}

async function replenishmentPost() {
  try {
    const response = await axios.post('/api/balance/create_invoice', {
      title: 'Пополнение',
      price: sum.value,
      user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
    })

    if (response.status == 200 && response.data) {
      window.location.href = response.data
    }
  } catch (error) {
    console.log('ошибка при отправке суммы пополнение баланса ❌❌❌')
  }
}

async function withdrawPost() {
  try {
    const response = await axios.post('/api/balance/withdraw_govno', {
      user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
      amount: sum.value,
    })

    if (response.status == 200) {
      window.Telegram?.WebApp?.showPopup({
        title: '💩 Внимание, ассенизатор!',
        message: 'Во время ЗБТ вывод токенов осуществляется вручную — чтобы никакой криптокит с лопатой не утащил всё в канализацию разом. Потерпите, автоматизация уже на подходе (на телеге с бочкой)!',
        buttons: [{ text: 'OK', type: 'ok' }],
      })
    }
  } catch (error) {
    console.log('ошибка при отправки суммы вывода баланса ❌❌❌')
  }
}
</script>