<template>
  <div class="overflow-x-auto rounded-lg border border-zinc-700">
    <table class="min-w-full text-sm text-gray-300">
      <thead class="bg-zinc-900 text-cyan-400 uppercase">
        <tr>
          <th class="px-4 py-2 text-left">Materia</th>
          <th class="px-4 py-2 text-left">Código</th>
          <th class="px-4 py-2 text-left">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ins in inscripciones"
          :key="ins.id"
          class="hover:bg-zinc-800 transition"
        >
          <td class="px-4 py-2">{{ ins.materia?.nombre }}</td>
          <td class="px-4 py-2">{{ ins.materia?.codigo }}</td>
          <td class="px-4 py-2 text-emerald-400">{{ ins.estado }}</td>
        </tr>
        <tr v-if="inscripciones.length === 0">
          <td colspan="3" class="py-3 text-center text-gray-500">
            No hay inscripciones aún.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{ inscripciones: any[] }>()
</script>
<style scoped></style>