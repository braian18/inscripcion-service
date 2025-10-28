import { Router } from "express";
import { InscripcionController } from "../controllers/inscripcionController.js";

const router = Router();

router.get("/", InscripcionController.listar);
router.post("/", InscripcionController.crear);

export default router;
