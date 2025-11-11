import { Router } from "express";
import { MateriaController } from "../controllers/materiasController.js";
const router = Router();

router.get("/disponibles/:alumno_id", MateriaController.listarDisponibles);

export default router;