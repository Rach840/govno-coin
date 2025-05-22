<template>
  <div id="content_app" class="flex flex-col gap-[5vw] relative z-[3] overflow-hidden box-border">
    <p class="text-h1 font-medium">$GOVNO кошелёк</p>
    <div class="bg-[linear-gradient(162deg,_#3C3C3C_0%,_#2F2F2F_100%)] rounded-[6vw] p-[3vw]">
      <div class="flex flex-col gap-1">
        <p class="text-support-text">Общий баланс</p>
        <div class="flex flex-col gap-0.5">
          <p class="text-h0 font-bold"> $ {{ valueUsdt >= 0 ? valueUsdt.toFixed(2) : '...' }} </p>
          <span class="text-support-text"> ~ {{ valueGovno >= 0 ? valueGovno.toFixed(2) : '...' }} $GOVNO </span>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-support-text">Общий баланс</p>
        <div class="flex flex-col gap-0.5">
          <p class="text-h0 font-bold"> $ {{ valueUsdt >= 0 ? valueUsdt.toFixed(2) : '...' }} </p>
          <span class="text-support-text"> ~ {{ valueGovno >= 0 ? valueGovno.toFixed(2) : '...' }} $GOVNO </span>
        </div>
      </div>
      
      <div class="flex flex-col gap-4 w-full">
        <div class="flex items-center gap-2">
          <button id="select-replenishment" @click="actionSelect = 'replenishment'" :class="['px-4 py-2 rounded-lg transition-colors', actionSelect === 'replenishment' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground']"> Пополнение</button>
          <button id="select-withdrawal" @click="actionSelect = 'withdrawal'" :class="['px-4 py-2 rounded-lg transition-colors', actionSelect === 'withdrawal' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground']">Вывод</button>
        </div>
        <div class="flex flex-col items-center gap-2 w-full">
          <CustomInput class="flex-1" v-model="userValue" placeholderText="" filterMode="numericAndDot"/>
          <button class="bg-reder text-white p-4">Криптой</button>

          
         <div class="bg-blue">
  
  </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CustomInput from '~/components/CustomInput.vue'

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