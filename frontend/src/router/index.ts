import { createRouter, createWebHistory } from 'vue-router'
import InscripcionView from '../views/InscripcionView.vue'

const routes = [
  { path: '/', name: 'inscripcion', component: InscripcionView }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
