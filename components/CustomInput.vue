<template>
  <div
    ref="containerEl"
    class="relative w-full"
  >
    <input
      ref="inputEl"
      v-model="localValue"
      @focus="onFocus"
      @blur="onBlur"
      type="text"
      class="relative z-[1] w-full bg-transparent border-none focus:outline-none text-base"
    />
    <p
      v-if="!localValue && !isFocused"
      class="absolute top-1/2 left-0 -translate-y-1/2 text-muted-foreground pointer-events-none select-none m-0"
    >
      {{ placeholderText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue?: string,
  placeholderText?: string,
  filterMode?: 'numeric' | 'numericAndDot' | 'letters' | null,
  maxValue?: number,
  minValue?: number,
}>()

const emit = defineEmits(['update:modelValue'])

const isFocused = ref(false)
const localValue = ref(props.modelValue || '')

const inputEl = ref<HTMLInputElement | null>(null)
const containerEl = ref<HTMLElement | null>(null)

const backButton = window?.Telegram?.WebApp?.BackButton

function showBack() {
  if (!backButton) return
  backButton.show()
  backButton.onClick(unfocusInput)
}

function hideBack() {
  if (!backButton) return
  backButton.hide()
  backButton.offClick(unfocusInput)
}

function unfocusInput() {
  inputEl.value?.blur()
}

function onClickOutside(event: MouseEvent) {
  if (!inputEl.value) return
  if (
    event.target instanceof Node &&
    !inputEl.value.contains(event.target) &&
    !(containerEl.value?.contains(event.target))
  ) {
    unfocusInput()
  }
}

function onFocus() {
  isFocused.value = true
  showBack()
  document.addEventListener('click', onClickOutside)
}

function onBlur() {
  isFocused.value = false
  hideBack()
  document.removeEventListener('click', onClickOutside)
}

watch(() => props.modelValue, (newVal) => {
  if (newVal !== localValue.value) {
    localValue.value = newVal || ''
  }
})

watch(localValue, (val) => {
  let value = val

  switch (props.filterMode) {
    case 'numeric':
      value = value.replace(/[^\d]/g, '')
      break
    case 'numericAndDot':
      value = value.replace(/[^\d.]/g, '')
      const parts = value.split('.')
      if (parts.length > 1) {
        value = parts[0] + '.' + parts.slice(1).join('')
      }
      break
    case 'letters':
      value = value.replace(/[^a-zA-Zа-яА-ЯёЁ0-9 .]/g, '')
      break
  }



  if (props.maxValue !== undefined && value !== '') {
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue) && numericValue > props.maxValue) {
      value = props.maxValue.toString()
    }
  }

  if (props.minValue !== undefined && value !== '') {
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue) && numericValue < props.minValue) {
      value = props.minValue.toString()
    }
  }

  if (value !== localValue.value) {
    localValue.value = value
  }

  emit('update:modelValue', value)
})

onMounted(() => {
  window?.Telegram?.WebApp?.ready()
})

onBeforeUnmount(() => {
  backButton?.offClick(unfocusInput)
  document.removeEventListener('click', onClickOutside)
})
</script>
