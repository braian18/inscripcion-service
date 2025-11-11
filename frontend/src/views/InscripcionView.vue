<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInscripcionStore } from '@/stores/inscripcionStore'
import Toast from '@/components/Toast.vue'

// Pinia store
const store = useInscripcionStore()

// Toast de mensajes
const toast = ref<{
    show: boolean
    message: string
    type?: 'success' | 'error'
}>({
    show: false,
    message: '',
    type: 'success',
})

// 🚀 Cargar datos al iniciar
onMounted(() => {
    store.fetchMateriasDisponibles()
    store.fetchInscripciones()
})

// 🟢 Inscribirse
async function handleInscripcion(materiaId: number) {
    const result = await store.inscribirse(materiaId)
    toast.value = {
        show: true,
        message: result.message,
        type: result.success ? 'success' : 'error',
    }
}

// 🔴 Cancelar inscripción
async function handleCancelar(inscripcionId: number) {
    const result = await store.cancelarInscripcion(inscripcionId)
    toast.value = {
        show: true,
        message: result.message,
        type: result.success ? 'success' : 'error',
    }
}
</script>

<template>
    <div class="p-6 bg-gray-900 text-white min-h-screen">
        <h1 class="text-3xl font-bold mb-4">Inscripción de Materias</h1>
        <p class="text-lg mb-6">
            Alumno:
            <span class="font-semibold">{{ store.alumnoNombre }}</span>
            —
            Carrera:
            <span class="font-semibold">{{ store.carreraNombre }}</span>
        </p>

        <div class="grid grid-cols-2 gap-8">
            <!-- 📚 Materias disponibles -->
            <div>
                <h2 class="text-2xl mb-4 text-emerald-400">Materias disponibles</h2>
                <ul>
                    <li v-for="materia in store.materiasDisponibles" :key="materia.id"
                        class="flex justify-between items-center bg-gray-800 p-3 rounded mb-2">
                        <span>{{ materia.nombre }}</span>
                        <button @click="handleInscripcion(materia.id)"
                            class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 rounded transition">
                            Inscribirme
                        </button>
                    </li>
                </ul>
                <p v-if="!store.materiasDisponibles.length" class="text-gray-400">
                    No hay materias disponibles para inscribirse.
                </p>
            </div>

            <!-- 🧾 Inscripciones -->
            <div>
                <h2 class="text-2xl mb-4 text-cyan-400">Mis inscripciones</h2>
                <table class="min-w-full border border-gray-700 rounded-lg overflow-hidden">
                    <thead class="bg-gray-800">
                        <tr>
                            <th class="p-2 text-left">Materia</th>
                            <th class="p-2 text-left">Estado</th>
                            <th class="p-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="ins in store.inscripciones.filter(i => i.estado === 'ACTIVA')" :key="ins.id"
                            class="border-t border-gray-700 trnsition hover:bg-gray-700">
                            <td class="p-2">{{ ins.materia.nombre }}</td>
                            <td class="p-2 font-semibold" :class="{
                                'text-emerald-400': ins.estado === 'ACTIVA',
                                'text-rose-400': ins.estado === 'CANCELADA',
                                'text-yellow-400': ins.estado === 'FINALIZADA',
                            }">
                                {{ ins.estado }}
                            </td>
                            <td class="p-2">
                                <button v-if="ins.estado === 'ACTIVA'" @click="handleCancelar(ins.id)"
                                    class="px-3 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded-md text-sm transition">
                                    Cancelar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p v-if="!store.inscripciones.length" class="text-gray-400 mt-3">
                    No hay inscripciones registradas.
                </p>
            </div>
        </div>

        <!-- 🔔 Toast -->
        <Toast :show="toast.show" :message="toast.message" :type="toast.type" />
    </div>
</template>

<style scoped>
/* (Opcional) animación sutil del hover */
button {
    transition: background-color 0.2s ease;
}
</style>
