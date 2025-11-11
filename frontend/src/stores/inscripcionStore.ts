import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000' 

export const useInscripcionStore = defineStore('inscripcion', {
  state: () => ({
    alumnoId: 1,
    alumnoNombre: '',
    carreraNombre: '',
    materiasDisponibles: [] as any[],
    inscripciones: [] as any[],
    loading: false,
    error: null as string | null,
  }),

  actions: {

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


    async fetchInscripciones() {
      try {
        const res = await axios.get(`${API_URL}/api/inscripciones?alumnoId=${this.alumnoId}`)
        this.inscripciones = res.data
      } catch (err: any) {
        console.error('Error al obtener inscripciones:', err)
      }
    },


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


    async cancelarInscripcion(inscripcionId: number) {
  try {
    await axios.put(`${API_URL}/api/inscripciones/${inscripcionId}/cancelar`)

 
    this.inscripciones = this.inscripciones.map((ins) =>
      ins.id === inscripcionId ? { ...ins, estado: 'CANCELADA' } : ins
    )


    await this.fetchMateriasDisponibles()

    return { success: true, message: 'Inscripción cancelada correctamente 🟥' }
  } catch (err: any) {
    console.error('Error al cancelar inscripción:', err)
    return { success: false, message: 'Error al cancelar inscripción ❌' }
  }
}
  },
})
