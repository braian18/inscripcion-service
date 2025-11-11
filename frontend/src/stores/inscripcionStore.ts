import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000' // URL del backend

export const useInscripcionStore = defineStore('inscripcion', {
  state: () => ({
    alumnoId: 3,
    alumnoNombre: '',
    carreraNombre: '',
    materiasDisponibles: [] as any[],
    inscripciones: [] as any[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // 📘 Obtener materias disponibles
    async fetchMateriasDisponibles() {
      this.loading = true
      try {
        const res = await axios.get(`${API_URL}/materias/disponibles/${this.alumnoId}`)
        this.alumnoNombre = res.data.alumno
        this.carreraNombre = res.data.carrera
        this.materiasDisponibles = res.data.materias_disponibles
      } catch (err: any) {
        console.error('Error al obtener materias disponibles:', err)
        this.error = 'No se pudieron cargar las materias'
      } finally {
        this.loading = false
      }
    },

    // 📘 Obtener inscripciones actuales
    async fetchInscripciones() {
      try {
        const res = await axios.get(`${API_URL}/api/inscripciones?alumnoId=${this.alumnoId}`)
        this.inscripciones = res.data
      } catch (err: any) {
        console.error('Error al obtener inscripciones:', err)
      }
    },

    // 🟢 Inscribirse a una materia
    async inscribirse(materiaId: number) {
      try {
        await axios.post(`${API_URL}/api/inscripciones`, {
          alumno_id: this.alumnoId,
          materia_id: materiaId,
        })
        await this.fetchMateriasDisponibles()
        await this.fetchInscripciones()
        return { success: true, message: 'Inscripción realizada con éxito ✅' }
      } catch (err: any) {
        if (err.response?.status === 409) {
          return { success: false, message: 'Ya estás inscrito en esta materia ⚠️' }
        }
        return { success: false, message: 'Error al inscribirse ❌' }
      }
    },

    // 🔴 Cancelar una inscripción
    async cancelarInscripcion(inscripcionId: number) {
  try {
    await axios.put(`${API_URL}/api/inscripciones/${inscripcionId}/cancelar`)

    // Actualizamos solo en memoria sin recargar todo
    this.inscripciones = this.inscripciones.map((ins) =>
      ins.id === inscripcionId ? { ...ins, estado: 'CANCELADA' } : ins
    )

    // Opcional: actualizamos materias disponibles (si querés que vuelva a aparecer)
    await this.fetchMateriasDisponibles()

    return { success: true, message: 'Inscripción cancelada correctamente 🟥' }
  } catch (err: any) {
    console.error('Error al cancelar inscripción:', err)
    return { success: false, message: 'Error al cancelar inscripción ❌' }
  }
}
  },
})
