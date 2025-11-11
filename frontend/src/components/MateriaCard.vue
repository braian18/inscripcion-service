<template>
  <div class="bg-zinc-800 border border-zinc-700 rounded-xl p-4 hover:bg-zinc-700 transition">
    <h3 class="text-lg font-semibold">{{ materia.nombre }}</h3>
    <p class="text-sm text-gray-400">Código: {{ materia.codigo }}</p>
    <p class="text-sm text-gray-400">Cupo: {{ materia.cupo_maximo }}</p>
    <p class="text-sm text-gray-400">Carrera: {{ materia.carrera?.nombre }}</p>

    <button
      @click="$emit('inscribirse')"
      class="mt-3 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-semibold transition"
    >
      Inscribirme
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ materia: any }>()
</script>
<style scoped></style>
