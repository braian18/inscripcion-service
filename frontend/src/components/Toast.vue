<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'error'
  show: boolean
}>()

const visible = ref(false)

watchEffect(() => {
  visible.value = props.show
  if (props.show) {
    setTimeout(() => (visible.value = false), 3000)
  }
})
</script>

<template>
  <transition
    enter-active-class="transition ease-out duration-500"
    enter-from-class="opacity-0 translate-y-3"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-500"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-3"
  >
    <div
      v-if="visible"
      class="fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white text-sm"
      :class="{
        'bg-emerald-600': type === 'success',
        'bg-rose-600': type === 'error'
      }"
    >
      {{ message }}
    </div>
  </transition>
</template>
<style scoped></style>