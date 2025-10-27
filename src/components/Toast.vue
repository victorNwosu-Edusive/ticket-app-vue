<template>
  <div :class="[bgColor, 'px-10 py-2 rounded-md fixed w-full md:w-fit top-4 md:top-5 md:right-5 z-50']">
    {{ message }}
    <button 
      @click="$emit('close')" 
      class="ml-3 hover:opacity-75"
    >
      ×
    </button>
  </div>
</template>

<script setup>

import { onMounted, onBeforeUnmount, computed } from 'vue'
const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success'
  }
})
const emit = defineEmits(['close'])
let timer
onMounted(() => {
  timer = setTimeout(() => emit('close'), 3000)
})
onBeforeUnmount(() => {
  clearTimeout(timer)
})
const bgColor = computed(() => {
  if (props.type === 'error') return 'bg-red-100 border-[1px] border-red-500 text-red-500'
  if (props.type === 'info') return 'bg-blue-500'
  return 'bg-green-100 border-[1px] border-green-500 text-green-500'
})
</script>